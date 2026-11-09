"""Procedural macro renders of three knit structures (placeholders, NOT photographs).

Usage: python scripts/render-fabric-macro.py <out-dir>
Needs numpy + pillow. Each fabric is a height field of twisted-yarn loops,
lit and shaded with depth of field. Replace the outputs with real catalog
photography when available; the card components only read the files.
"""
import sys
import numpy as np
from PIL import Image

W, H = 1000, 1300
TAU = np.pi * 2


def noise(shape, sx, sy, rng):
    n = rng.standard_normal(shape)
    f = np.fft.rfft2(n)
    fy = np.fft.fftfreq(shape[0])[:, None]
    fx = np.fft.rfftfreq(shape[1])[None, :]
    f *= np.exp(-((fx * sx) ** 2 + (fy * sy) ** 2))
    out = np.fft.irfft2(f, shape)
    return (out - out.mean()) / (out.std() + 1e-9)


def blur(img, s):
    f = np.fft.rfft2(img, axes=(0, 1))
    fy = np.fft.fftfreq(img.shape[0])[:, None]
    fx = np.fft.rfftfreq(img.shape[1])[None, :]
    k = np.exp(-((fx * s) ** 2 + (fy * s) ** 2))
    if img.ndim == 3:
        k = k[..., None]
    return np.fft.irfft2(f * k, img.shape[:2], axes=(0, 1))


def leg(u, v, centre, half):
    d = (u - centre) / half
    inside = np.clip(1 - d * d, 0, 1)
    return np.sqrt(inside), d


def render(name, rng, cw, ch, rib, rot, colour, light, tint, relief, twist, fuzz, dof, legw=0.29):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    a = np.deg2rad(rot)
    x = xx * np.cos(a) - yy * np.sin(a)
    y = xx * np.sin(a) + yy * np.cos(a)
    x = x + noise((H, W), 60, 60, rng) * cw * 0.06
    y = y + noise((H, W), 60, 60, rng) * ch * 0.06
    wale = cw * (2 if rib else 1)
    cu = x / wale
    cv = y / ch
    u = cu - np.floor(cu)
    v = cv - np.floor(cv)
    row = np.floor(cv)
    # slow per-course yarn thickness variation
    thick = 1 + 0.10 * np.sin(row * 1.7 + np.floor(cu) * 2.3)
    if rib:
        ku = np.clip(u / 0.62, 0, 1.2)  # knit wale occupies the first 62% of the cell
        in_knit = u < 0.62
    else:
        ku = u
        in_knit = np.ones_like(u, dtype=bool)
    # V stitch: legs spread at the top and meet at the bottom
    cl = 0.20 + 0.30 * v
    cr = 0.80 - 0.30 * v
    hl, dl = leg(ku, v, cl, legw * thick)
    hr, dr = leg(ku, v, cr, legw * thick)
    env = np.sin(np.pi * np.clip(v * 0.94 + 0.03, 0, 1)) ** 0.55
    ply_l = 0.5 + 0.5 * np.cos(TAU * (v * twist + dl * 0.55 + row * 0.13))
    ply_r = 0.5 + 0.5 * np.cos(TAU * (v * twist - dr * 0.55 + row * 0.31))
    h_l = hl * env * (0.60 + 0.40 * ply_l)
    h_r = hr * env * (0.60 + 0.40 * ply_r)
    knit_h = 0.10 + 0.90 * np.maximum(h_l, h_r)
    if rib:
        pu = np.clip((u - 0.62) / 0.38, 0, 1)
        purl = 0.10 + 0.22 * np.sin(np.pi * v) ** 2 * np.sin(np.pi * pu) ** 0.6
        height = np.where(in_knit, knit_h * 1.0 + 0.18, purl)
        height = blur(height, 1.6)
    else:
        height = knit_h
    # yarn irregularity and fibres
    height = height * (1 + 0.05 * noise((H, W), 14, 40, rng))
    fib = noise((H, W), 1.2, 4.5, rng)
    height = height + 0.05 * fib * (height > 0.1) * fuzz
    height = np.clip(blur(height, 1.1), 0, None)

    gx = np.gradient(height, axis=1) * relief
    gy = np.gradient(height, axis=0) * relief
    n = np.dstack([-gx, -gy, np.ones_like(gx)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    L = np.array(light, dtype=np.float32)
    L /= np.linalg.norm(L)
    diff = np.clip((n * L).sum(2), 0, 1)
    hs = blur(height, 10)
    ao = np.clip(0.55 + 0.55 * (height / (height.max() + 1e-6)) ** 0.8, 0, 1) * np.clip(0.85 + 0.3 * (height - hs), 0.6, 1.15)
    base = np.array(colour, dtype=np.float32) / 255
    var = 1 + 0.07 * noise((H, W), 25, 25, rng) + 0.04 * fib * fuzz
    albedo = base[None, None, :] * var[..., None]
    shade = (0.52 + 0.75 * diff) * ao
    img = albedo * shade[..., None] * np.array(tint, dtype=np.float32)
    # stray fibres catching light
    hair = np.clip(noise((H, W), 0.9, 7, rng) - 2.1, 0, 1) * 0.35
    img = img + hair[..., None] * base * 0.9
    img = np.clip(img, 0, 1)
    # macro depth of field and vignette
    yy2, xx2 = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((xx2 - W * 0.45) / (W * 0.8)) ** 2 + ((yy2 - H * 0.42) / (H * 0.8)) ** 2)
    m = np.clip((r - 0.35) / 0.55, 0, 1)[..., None]
    img = img * (1 - m) + blur(img, dof) * m
    img *= (1 - 0.18 * m)
    grain = rng.standard_normal((H, W, 1)).astype(np.float32) * 0.012
    img = np.clip(img + grain, 0, 1)
    out = (img ** (1 / 1.05) * 255).astype(np.uint8)
    return Image.fromarray(out)


def main(out_dir):
    specs = {
        "fabric-sage-macro": dict(seed=11, cw=44, ch=30, rib=False, legw=0.35, rot=2.0, colour=(138, 153, 133), light=(-0.45, -0.5, 0.75), tint=(1.0, 1.0, 0.98), relief=3.0, twist=2.6, fuzz=1.0, dof=7),
        "fabric-terracotta-macro": dict(seed=23, cw=40, ch=44, rib=True, rot=-1.5, colour=(168, 92, 74), light=(0.65, -0.35, 0.62), tint=(1.04, 1.0, 0.95), relief=3.8, twist=2.2, fuzz=1.2, dof=9),
        "fabric-navy-macro": dict(seed=37, cw=34, ch=25, rib=False, rot=0.8, colour=(42, 56, 84), light=(-0.3, -0.6, 0.7), tint=(0.95, 1.0, 1.1), relief=3.4, twist=3.2, fuzz=0.9, dof=6),
    }
    for name, s in specs.items():
        rng = np.random.default_rng(s.pop("seed"))
        im = render(name, rng, **s)
        im.save(f"{out_dir}/{name}.webp", quality=84, method=6)
        im.resize((W // 2, H // 2), Image.LANCZOS).save(f"{out_dir}/{name}-sm.webp", quality=82, method=6)
        print(name, im.size)


if __name__ == "__main__":
    main(sys.argv[1])
