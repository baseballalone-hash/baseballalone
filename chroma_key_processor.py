import os
import glob
from PIL import Image

def process_raw_assets():
    # Find the most recently generated raw files
    helmet_files = glob.glob("C:/Users/exbxda13/.gemini/antigravity-cli/brain/1f988a5f-3552-410b-a2aa-a4b07a8131b4/asset_raw_helmet_*.png")
    cap_files = glob.glob("C:/Users/exbxda13/.gemini/antigravity-cli/brain/1f988a5f-3552-410b-a2aa-a4b07a8131b4/asset_raw_cap_*.png")
    glasses_files = glob.glob("C:/Users/exbxda13/.gemini/antigravity-cli/brain/1f988a5f-3552-410b-a2aa-a4b07a8131b4/asset_raw_glasses_*.png")

    if not helmet_files or not cap_files or not glasses_files:
        print("Raw asset files not found. Check the paths.")
        return

    # Sort to get the latest
    helmet_raw = sorted(helmet_files)[-1]
    cap_raw = sorted(cap_files)[-1]
    glasses_raw = sorted(glasses_files)[-1]

    os.makedirs("assets/img", exist_ok=True)
    canvas_w, canvas_h = 420, 562

    # 파츠별 가공 스펙 (파일명, 타겟 크기(W, H), 타겟 좌표(X, Y))
    specs = {
        "helmet": {
            "src": helmet_raw,
            "dest": "assets/img/acc-helmet.webp",
            "size": (84, 76),
            "pos": (168, 64)
        },
        "cap": {
            "src": cap_raw,
            "dest": "assets/img/acc-cap.webp",
            "size": (74, 52),
            "pos": (173, 80)
        },
        "glasses": {
            "src": glasses_raw,
            "dest": "assets/img/acc-glasses.webp",
            "size": (64, 22),
            "pos": (178, 120)
        }
    }

    for key, spec in specs.items():
        # 1. 이미지 로드
        img = Image.open(spec["src"]).convert("RGBA")
        datas = img.getdata()

        # 2. 크로마키 누끼 따기 (RGB 값이 240 이상인 거의 흰색 픽셀들을 투명하게 치환)
        new_data = []
        for item in datas:
            # R, G, B가 모두 240 이상인 밝은 배경색을 투명(A=0)으로 변환
            if item[0] >= 240 and item[1] >= 240 and item[2] >= 240:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)

        # 3. 투명 배경 자르기 (Autocrop)
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)

        # 4. 캐릭터 머리 크기에 알맞게 리사이즈
        img = img.resize(spec["size"], Image.Resampling.LANCZOS)

        # 5. 420x562 빈 투명 캔버스 생성 및 붙여넣기
        canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        canvas.paste(img, spec["pos"], mask=img)

        # 6. 최종 고화질 WebP 저장
        canvas.save(spec["dest"], "WEBP", quality=95)
        print(f"Successfully deconstructed and generated: {spec['dest']}")

if __name__ == '__main__':
    process_raw_assets()
