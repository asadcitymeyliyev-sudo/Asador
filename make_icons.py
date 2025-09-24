from PIL import Image, ImageDraw, ImageFont

sizes = [192, 512]

for size in sizes:
    img = Image.new('RGB', (size, size), color='blue')  # фон синий
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()
    text = "A"
    
    # вычисляем размеры текста через textbbox
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    
    # центрируем текст
    draw.text(((size - w) / 2, (size - h) / 2), text, fill="yellow", font=font)
    
    img.save(f"icon-{size}.png")

print("Иконки созданы: icon-192.png и icon-512.png")
