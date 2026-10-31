"""Genera los assets de Simple Clima (icono, adaptive icon, splash y gráficos de tienda)."""
from PIL import Image, ImageDraw, ImageFont
import os, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_DIR = os.path.join(ROOT, "assets")
STORE_DIR = os.path.join(ROOT, "store")
os.makedirs(APP_DIR, exist_ok=True)
os.makedirs(STORE_DIR, exist_ok=True)

# Los assets que empaqueta la app van a assets/; los de la ficha, a store/.
STORE_FILES = {"play-icon-512.png", "feature-graphic-1024x500.png"}

def out_path(name):
    return os.path.join(STORE_DIR if name in STORE_FILES else APP_DIR, name)
SS = 4  # supersampling

BG        = (18, 24, 43)
BG_GLOW   = (37, 48, 77)
SUN       = (255, 194, 75)
SUN_EDGE  = (255, 161, 54)
CLOUD     = (237, 242, 253)
CLOUD_SH  = (199, 208, 229)
TEXT      = (255, 255, 255)
TEXT_MUT  = (199, 208, 229)
ACCENT    = (125, 177, 255)

FONT_DIR = "/usr/share/fonts/truetype/google-fonts"
def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)

def radial_bg(size, inner=BG_GLOW, outer=BG, cy_ratio=0.42):
    """Fondo con un glow radial suave."""
    w = h = size
    img = Image.new("RGB", (w, h), outer)
    px = img.load()
    cx, cy = w * 0.5, h * cy_ratio
    maxd = math.hypot(w, h) * 0.58
    for y in range(h):
        for x in range(w):
            t = min(1.0, math.hypot(x - cx, y - cy) / maxd)
            t = t ** 1.4
            px[x, y] = tuple(int(inner[i] + (outer[i] - inner[i]) * t) for i in range(3))
    return img

def draw_art(d, cx, cy, s):
    """Sol detrás de una nube. (cx, cy) es el centro del arte; s su ancho nominal."""
    # rayos
    sun_cx, sun_cy, sun_r = cx + 0.15 * s, cy - 0.20 * s, 0.215 * s
    ray_in, ray_out, ray_w = sun_r * 1.34, sun_r * 1.82, s * 0.030
    for i in range(8):
        a = math.radians(i * 45 - 90)
        x1, y1 = sun_cx + math.cos(a) * ray_in,  sun_cy + math.sin(a) * ray_in
        x2, y2 = sun_cx + math.cos(a) * ray_out, sun_cy + math.sin(a) * ray_out
        d.line([(x1, y1), (x2, y2)], fill=SUN_EDGE, width=int(ray_w), joint="curve")
    # sol
    d.ellipse([sun_cx - sun_r, sun_cy - sun_r, sun_cx + sun_r, sun_cy + sun_r], fill=SUN)
    d.ellipse([sun_cx - sun_r * 0.62, sun_cy - sun_r * 0.72,
               sun_cx + sun_r * 0.30, sun_cy + sun_r * 0.10], fill=(255, 214, 122))
    # nube
    base_top, base_bot = cy + 0.13 * s, cy + 0.325 * s
    d.rounded_rectangle([cx - 0.42 * s, base_top, cx + 0.36 * s, base_bot],
                        radius=(base_bot - base_top) / 2, fill=CLOUD)
    for ox, oy, r in ((-0.09, 0.03, 0.225), (0.165, 0.075, 0.165), (-0.295, 0.095, 0.145)):
        d.ellipse([cx + (ox - r) * s, cy + (oy - r) * s,
                   cx + (ox + r) * s, cy + (oy + r) * s], fill=CLOUD)

def canvas(size, bg=None, transparent=False):
    n = size * SS
    if transparent:
        img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    else:
        img = (bg or radial_bg(size)).resize((n, n), Image.LANCZOS).convert("RGBA")
    return img, ImageDraw.Draw(img)

def save(img, name, size):
    img.resize((size, size), Image.LANCZOS).save(out_path(name))
    print("  ", name)

# --- icono de la app (full bleed) ---
bg = radial_bg(1024)
img, d = canvas(1024, bg=bg)
draw_art(d, 512 * SS, 522 * SS, 620 * SS)
save(img, "icon.png", 1024)
save(img, "play-icon-512.png", 512)

# --- adaptive icon: solo primer plano, dentro de la zona segura central (66%) ---
img, d = canvas(1024, transparent=True)
draw_art(d, 512 * SS, 522 * SS, 470 * SS)
save(img, "adaptive-icon.png", 1024)

# --- splash: arte transparente sobre el color de fondo de app.json ---
img, d = canvas(1024, transparent=True)
draw_art(d, 512 * SS, 512 * SS, 540 * SS)
save(img, "splash-icon.png", 1024)

# --- gráfico destacado 1024x500 ---
W, H = 1024, 500
base = Image.new("RGB", (W, H), BG)
px = base.load()
for y in range(H):
    for x in range(W):
        t = min(1.0, math.hypot(x - W * 0.26, y - H * 0.45) / (W * 0.62)) ** 1.3
        px[x, y] = tuple(int(BG_GLOW[i] + (BG[i] - BG_GLOW[i]) * t) for i in range(3))
fg = base.resize((W * SS, H * SS), Image.LANCZOS).convert("RGBA")
d = ImageDraw.Draw(fg)
draw_art(d, 260 * SS, 250 * SS, 330 * SS)
f_title = font("Poppins-Bold.ttf", 67 * SS)
f_sub   = font("Poppins-Regular.ttf", 31 * SS)
f_small = font("Poppins-Medium.ttf", 25 * SS)
tx = 455 * SS
d.text((tx, 178 * SS), "Simple Clima", font=f_title, fill=TEXT)
d.text((tx, 266 * SS), "El pronóstico de la semana,", font=f_sub, fill=TEXT_MUT)
d.text((tx, 305 * SS), "sin vueltas.", font=f_sub, fill=TEXT_MUT)
d.text((tx, 364 * SS), "Gratis · Sin anuncios · Sin cuentas", font=f_small, fill=ACCENT)
fg.resize((W, H), Image.LANCZOS).convert("RGB").save(out_path("feature-graphic-1024x500.png"))
print("   feature-graphic-1024x500.png")
