"""Draws the 1200x630 example image (a sourdough loaf on a board) used on first load.

Run: python tools/make-example-image.py  ->  public/example.jpg
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

W, H = 1200, 630
S = 2  # draw at 2x, then downscale for smooth edges
OUT = Path(__file__).resolve().parent.parent / "public" / "example.jpg"
random.seed(7)


def lerp(a, b, t):
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def vertical_gradient(size, top, bottom):
    img = Image.new("RGB", size)
    d = ImageDraw.Draw(img)
    for y in range(size[1]):
        d.line([(0, y), (size[0], y)], fill=lerp(top, bottom, y / size[1]))
    return img


img = vertical_gradient((W * S, H * S), (247, 233, 212), (233, 205, 166))
draw = ImageDraw.Draw(img)

# Soft sun-like glow behind the loaf
glow = Image.new("L", img.size, 0)
ImageDraw.Draw(glow).ellipse([(640 * S, 40 * S), (1180 * S, 580 * S)], fill=120)
glow = glow.filter(ImageFilter.GaussianBlur(90 * S))
img.paste((255, 246, 230), mask=glow)

# Wooden board with handle
board = (110, 72, 44)
board_light = (150, 103, 64)
draw = ImageDraw.Draw(img)
draw.rounded_rectangle([(470 * S, 420 * S), (1150 * S, 540 * S)], radius=60 * S, fill=board)
draw.rounded_rectangle([(470 * S, 410 * S), (1150 * S, 520 * S)], radius=60 * S, fill=board_light)
draw.rounded_rectangle([(1100 * S, 440 * S), (1190 * S, 490 * S)], radius=25 * S, fill=board_light)
for i in range(7):  # wood grain
    y = (430 + i * 13) * S
    draw.arc([(520 * S, y - 20 * S), (1090 * S, y + 20 * S)], 10, 170, fill=(135, 91, 56), width=2 * S)

# Loaf shadow
shadow = Image.new("L", img.size, 0)
ImageDraw.Draw(shadow).ellipse([(560 * S, 400 * S), (1060 * S, 470 * S)], fill=150)
shadow = shadow.filter(ImageFilter.GaussianBlur(18 * S))
img.paste((80, 50, 28), mask=shadow)

# Loaf: layered ellipses from dark crust to golden top
draw = ImageDraw.Draw(img)
cx, cy = 810, 300
crust, golden = (112, 60, 24), (224, 170, 104)
steps = 60
for i in range(steps):
    t = i / (steps - 1)
    rx = 260 - 90 * t
    ry = 150 - 62 * t
    oy = 20 - 22 * t  # highlight sits a little higher than the base
    draw.ellipse([((cx - rx) * S, (cy - ry + oy) * S), ((cx + rx) * S, (cy + ry + oy) * S)],
                 fill=lerp(crust, golden, min(1, t * 1.6)))


def stroke(points, width, fill):
    """A smooth thick curve: a disc at every sample point."""
    r = width / 2
    for x, y in points:
        draw.ellipse([((x - r) * S, (y - r) * S), ((x + r) * S, (y + r) * S)], fill=fill)


# Score marks: a pale flour-dusted ridge with a dark cut inside
for off in (-120, 0, 120):
    x0 = cx + off
    pts = []
    for t in range(0, 241):
        tt = t / 240
        x = x0 - 62 + 124 * tt
        y = cy - 70 + 170 * tt - math.sin(tt * math.pi) * 18
        pts.append((x, y))
    stroke(pts, 24, (240, 210, 160))
    stroke(pts, 9, (150, 86, 36))

# Flour dusting on the loaf and board
flour = Image.new("L", img.size, 0)
fd = ImageDraw.Draw(flour)
for _ in range(900):
    a = random.random() * 2 * math.pi
    r = math.sqrt(random.random())
    x = cx + math.cos(a) * r * 230
    y = cy + 20 + math.sin(a) * r * 120 - 30
    s = random.uniform(1, 3.2)
    fd.ellipse([((x - s) * S, (y - s) * S), ((x + s) * S, (y + s) * S)], fill=random.randint(60, 170))
for _ in range(260):
    x = random.uniform(500, 1120)
    y = random.uniform(420, 515)
    s = random.uniform(1, 2.6)
    fd.ellipse([((x - s) * S, (y - s) * S), ((x + s) * S, (y + s) * S)], fill=random.randint(80, 200))
flour = flour.filter(ImageFilter.GaussianBlur(1.2 * S))
img.paste((255, 251, 242), mask=flour)

# Wheat stalks on the left
draw = ImageDraw.Draw(img)
wheat = (196, 150, 82)
wheat_dark = (160, 116, 58)
for bx, by, ang in ((150, 560, -20), (215, 575, -6), (285, 565, 10)):
    a = math.radians(ang)
    tip = (bx + math.sin(a) * 420, by - math.cos(a) * 420)
    draw.line([(bx * S, by * S), (tip[0] * S, tip[1] * S)], fill=wheat_dark, width=5 * S)
    for k in range(9):
        t = 0.55 + k * 0.05
        px = bx + math.sin(a) * 420 * t
        py = by - math.cos(a) * 420 * t
        for side in (-1, 1):
            g = a + side * math.radians(28)
            ex = px + math.sin(g) * 34
            ey = py - math.cos(g) * 34
            mx, my = (px + ex) / 2, (py + ey) / 2
            draw.ellipse([((mx - 9) * S, (my - 15) * S), ((mx + 9) * S, (my + 15) * S)], fill=wheat)

img = img.resize((W, H), Image.LANCZOS)
OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, "JPEG", quality=86, optimize=True, progressive=True)
print("wrote", OUT, img.size)
