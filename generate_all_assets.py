import os
from PIL import Image, ImageDraw

# 색상 정보 동기화
SKIN_COLORS = ["#ecc7a1", "#e6b889", "#f0c89b", "#e3b07a", "#eccfa9"]
HAIR_COLORS = ["#1a1a1a", "#2a1a0f", "#5a3a1d", "#b03030", "#d8a040"]
HAIR_STYLES = ["short", "curly", "neat", "long", "spiky"]
ACCESSORIES = ["cap", "glasses", "helmet", "scar", "blush"]
EYES = ["calm", "sharp", "smile", "cool", "fierce"]
FACE_SHAPES = ["round", "square", "vshape"]

WIDTH, HEIGHT = 420, 562
SCALE = 1.03
XC, YC = 210, 123 # 머리 중심 좌표

def to_canvas(cx, cy):
    # SVG 100x100 좌표계를 420x562 캔버스 상의 머리 정렬 좌표계로 매핑
    px = XC + (cx - 50) * SCALE
    py = YC + (cy - 52) * SCALE
    return int(px), int(py)

def hex_to_rgb(hex_str, alpha=255):
    hex_str = hex_str.lstrip('#')
    return int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16), alpha

def build_all_assets():
    os.makedirs("assets/img", exist_ok=True)
    print("Starting generation of all 75 layered assets...")

    # ==========================================
    # 1. 얼굴 윤곽 (15장)
    # ==========================================
    for shape in FACE_SHAPES:
        for s_idx, skin_color in enumerate(SKIN_COLORS):
            img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            fill_rgb = hex_to_rgb(skin_color)
            stroke_rgb = (17, 17, 17, 255)

            if shape == "round":
                rx, ry = int(25 * SCALE), int(29 * SCALE)
                draw.ellipse([XC - rx, YC - ry, XC + rx, YC + ry], fill=fill_rgb, outline=stroke_rgb, width=2)
                # 턱 밑 음영
                draw.chord([XC - rx, YC - ry, XC + rx, YC + ry], start=20, end=160, fill=(0, 0, 0, 20))
            elif shape == "square":
                rx, ry = int(25 * SCALE), int(28 * SCALE)
                draw.rounded_rectangle([XC - rx, YC - ry, XC + rx, YC + ry], radius=10, fill=fill_rgb, outline=stroke_rgb, width=2)
                draw.chord([XC - rx, YC - ry, XC + rx, YC + ry], start=20, end=160, fill=(0, 0, 0, 20))
            elif shape == "vshape":
                pts = [to_canvas(25, 38), to_canvas(40, 26), to_canvas(60, 26), to_canvas(75, 38), to_canvas(62, 70), to_canvas(50, 81), to_canvas(38, 70)]
                draw.polygon(pts, fill=fill_rgb, outline=stroke_rgb, width=2)
                draw.polygon([to_canvas(38, 70), to_canvas(50, 81), to_canvas(62, 70)], fill=(0, 0, 0, 20))

            # 귀 그리기
            # 왼쪽 귀
            el, et = to_canvas(23 - 4.5, 54 - 6.5)
            er, eb = to_canvas(23 + 4.5, 54 + 6.5)
            draw.ellipse([el, et, er, eb], fill=fill_rgb, outline=stroke_rgb, width=2)
            # 오른쪽 귀
            el, et = to_canvas(77 - 4.5, 54 - 6.5)
            er, eb = to_canvas(77 + 4.5, 54 + 6.5)
            draw.ellipse([el, et, er, eb], fill=fill_rgb, outline=stroke_rgb, width=2)

            img.save(f"assets/img/head-{shape}-skin{s_idx + 1}.webp", "WEBP")
    print("Created: 15 head-shapes.")

    # ==========================================
    # 2. 눈모양 (5장)
    # ==========================================
    for eye in EYES:
        img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        eye_y = 130
        
        if eye == "calm":
            draw.ellipse([201 - 3, eye_y - 3, 201 + 3, eye_y + 3], fill=(20, 20, 20, 255))
            draw.ellipse([218 - 3, eye_y - 3, 218 + 3, eye_y + 3], fill=(20, 20, 20, 255))
            draw.ellipse([200 - 1, eye_y - 2, 200 + 1, eye_y], fill=(255, 255, 255, 255))
            draw.ellipse([217 - 1, eye_y - 2, 217 + 1, eye_y], fill=(255, 255, 255, 255))
        elif eye == "sharp":
            draw.polygon([(197, eye_y + 1), (205, eye_y - 2), (202, eye_y + 3)], fill=(20, 20, 20, 255))
            draw.polygon([(222, eye_y + 1), (214, eye_y - 2), (217, eye_y + 3)], fill=(20, 20, 20, 255))
        elif eye == "smile":
            draw.arc([198, eye_y - 4, 205, 134], start=180, end=360, fill=(20, 20, 20, 255), width=2)
            draw.arc([214, eye_y - 4, 221, 134], start=180, end=360, fill=(20, 20, 20, 255), width=2)
        elif eye == "cool":
            draw.rounded_rectangle([197, eye_y - 2, 205, eye_y + 1], radius=1, fill=(20, 20, 20, 255))
            draw.rounded_rectangle([214, eye_y - 2, 222, eye_y + 1], radius=1, fill=(20, 20, 20, 255))
        elif eye == "fierce":
            draw.ellipse([201 - 2, eye_y - 1, 201 + 2, eye_y + 3], fill=(20, 20, 20, 255))
            draw.ellipse([218 - 2, eye_y - 1, 218 + 2, eye_y + 3], fill=(20, 20, 20, 255))
            # 화난 눈썹
            draw.line([195, eye_y - 5, 206, eye_y - 2], fill=(20, 20, 20, 255), width=2)
            draw.line([223, eye_y - 5, 212, eye_y - 2], fill=(20, 20, 20, 255), width=2)

        img.save(f"assets/img/eye-{eye}.webp", "WEBP")
    print("Created: 5 eye styles.")

    # ==========================================
    # 3. 앞머리 & 뒷머리 (50장)
    # ==========================================
    for style in HAIR_STYLES:
        for c_idx, hair_color in enumerate(HAIR_COLORS):
            color_rgb = hex_to_rgb(hair_color)
            stroke_rgb = (17, 17, 17, 255)
            
            # (1) 뒷머리 (hair-back)
            back_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            back_draw = ImageDraw.Draw(back_img)
            
            if style != "bald":
                # 뒷머리 둥글게 볼륨
                el, et = to_canvas(50 - 33, 42 - 33)
                er, eb = to_canvas(50 + 33, 42 + 33)
                back_draw.ellipse([el, et, er, eb], fill=color_rgb, outline=stroke_rgb, width=2)
                # 뒷머리 입체 음영
                back_draw.chord([el, et, er, eb], start=0, end=180, fill=(0, 0, 0, 40))
                
            back_img.save(f"assets/img/hair-back-{style}-color{c_idx + 1}.webp", "WEBP")

            # (2) 앞머리 (hair-front)
            front_img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            front_draw = ImageDraw.Draw(front_img)
            
            if style == "short":
                pts = [to_canvas(23, 38), to_canvas(35, 28), to_canvas(50, 26), to_canvas(65, 28), to_canvas(77, 38), to_canvas(50, 31)]
                front_draw.polygon(pts, fill=color_rgb, outline=stroke_rgb, width=2)
            elif style == "curly":
                # 꼽슬 몽실몽실 서클
                for i in range(6):
                    cx, cy = to_canvas(24 + i * 10.4, 30 + (3 if i % 2 == 0 else 0))
                    r = int(8 * SCALE)
                    front_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color_rgb, outline=stroke_rgb, width=2)
            elif style == "neat":
                # 댄디컷 차분한 앞머리
                pts = [to_canvas(23, 40), to_canvas(40, 22), to_canvas(56, 31), to_canvas(77, 38), to_canvas(50, 28)]
                front_draw.polygon(pts, fill=color_rgb, outline=stroke_rgb, width=2)
            elif style == "long":
                # 장발 옆머리 흘러내림
                pts = [to_canvas(21, 38), to_canvas(50, 14), to_canvas(79, 38), to_canvas(80, 68), to_canvas(68, 55), to_canvas(50, 60), to_canvas(32, 55), to_canvas(20, 68)]
                front_draw.polygon(pts, fill=color_rgb, outline=stroke_rgb, width=2)
            elif style == "spiky":
                # 초사이언 뾰족 앞머리
                pts = [to_canvas(21, 38), to_canvas(25, 18), to_canvas(33, 24), to_canvas(41, 8), to_canvas(49, 20), to_canvas(58, 6), to_canvas(66, 20), to_canvas(74, 10), to_canvas(78, 24), to_canvas(84, 18), to_canvas(84, 38), to_canvas(50, 33)]
                front_draw.polygon(pts, fill=color_rgb, outline=stroke_rgb, width=2)
                
            # 대머리가 아닐 때 하이라이트 엔젤링 얹기
            if style != "bald":
                hl_pts = [to_canvas(32, 28), to_canvas(50, 24), to_canvas(68, 28)]
                front_draw.line(hl_pts, fill=(255, 255, 255, 60), width=3)
                
            front_img.save(f"assets/img/hair-front-{style}-color{c_idx + 1}.webp", "WEBP")
    print("Created: 50 front/back hair combinations.")

    # ==========================================
    # 4. 액세서리 (5장)
    # ==========================================
    for acc in ACCESSORIES:
        img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        stroke_rgb = (17, 17, 17, 255)

        if acc == "cap":
            # 빨간 모자 캡
            el, et = to_canvas(21, 42 - 10)
            er, eb = to_canvas(79, 46)
            draw.chord([el, et, er, eb], start=180, end=360, fill=(176, 48, 48, 255), outline=stroke_rgb, width=2)
            # 챙
            draw.polygon([to_canvas(14, 46), to_canvas(56, 46), to_canvas(50, 51), to_canvas(20, 51)], fill=(122, 31, 31, 255), outline=stroke_rgb, width=2)
        elif acc == "glasses":
            # 안경테
            draw.ellipse([201 - 8, 130 - 8, 201 + 8, 130 + 8], outline=(30, 30, 30, 255), width=2)
            draw.ellipse([218 - 8, 130 - 8, 218 + 8, 130 + 8], outline=(30, 30, 30, 255), width=2)
            # 브릿지 및 다리
            draw.line([201 + 8, 130, 218 - 8, 130], fill=(30, 30, 30, 255), width=2)
            draw.line([193, 130, 175, 127], fill=(30, 30, 30, 255), width=2)
            draw.line([226, 130, 244, 127], fill=(30, 30, 30, 255), width=2)
        elif acc == "helmet":
            # 파란 헬멧
            el, et = to_canvas(17, 50 - 25)
            er, eb = to_canvas(83, 54)
            draw.chord([el, et, er, eb], start=180, end=360, fill=(38, 74, 138, 255), outline=stroke_rgb, width=2)
            # 귀 가리개
            draw.polygon([to_canvas(17, 50), to_canvas(17, 57), to_canvas(25, 61), to_canvas(31, 56)], fill=(32, 62, 117, 255), outline=stroke_rgb, width=2)
        elif acc == "scar":
            # 볼터치 자리에 빨간 흉터 X
            draw.line([188, 142, 196, 150], fill=(176, 48, 48, 255), width=3)
            draw.line([196, 142, 188, 150], fill=(176, 48, 48, 255), width=3)
        elif acc == "blush":
            # 분홍 볼터치
            draw.ellipse([187, 144, 195, 148], fill=(244, 63, 94, 110))
            draw.ellipse([225, 144, 233, 148], fill=(244, 63, 94, 110))

        img.save(f"assets/img/acc-{acc}.webp", "WEBP")
    print("Created: 5 accessories.")

    # ==========================================
    # 5. 몸통 (5장 - 피부색 매핑)
    # ==========================================
    # 타격 자세 기준으로 몸체 레이어 5종 생성 (목, 팔 부위 피부색 반영)
    for s_idx, skin_color in enumerate(SKIN_COLORS):
        img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        skin_rgb = hex_to_rgb(skin_color)
        stroke_rgb = (17, 17, 17, 255)
        
        # 2.33 배 픽셀 매핑
        # (1) 목
        draw.rectangle([int(-4*2.33) + 210, int(44*2.33) + 70, int(4*2.33) + 210, int(52*2.33) + 70], fill=skin_rgb, outline=stroke_rgb, width=2)
        # (2) 몸통 유니폼 (어깨~허리)
        body_pts = [
            (int(-28*2.33) + 210, int(52*2.33) + 70),
            (int(-22*2.33) + 210, int(48*2.33) + 70),
            (int(22*2.33) + 210, int(48*2.33) + 70),
            (int(28*2.33) + 210, int(52*2.33) + 70),
            (int(26*2.33) + 210, int(110*2.33) + 70),
            (int(-26*2.33) + 210, int(110*2.33) + 70)
        ]
        draw.polygon(body_pts, fill=(232, 237, 243, 255), outline=stroke_rgb, width=2)
        # 등번호 1
        draw.text((210, int(75*2.33) + 70), "1", fill=(78, 164, 255, 255), font_size=40, anchor="mm")
        
        # (3) 바지
        pants_pts = [
            (int(-26*2.33) + 210, int(110*2.33) + 70),
            (int(26*2.33) + 210, int(110*2.33) + 70),
            (int(22*2.33) + 210, int(168*2.33) + 70),
            (int(6*2.33) + 210, int(168*2.33) + 70),
            (int(4*2.33) + 210, int(130*2.33) + 70),
            (int(-4*2.33) + 210, int(130*2.33) + 70),
            (int(-6*2.33) + 210, int(168*2.33) + 70),
            (int(-22*2.33) + 210, int(168*2.33) + 70)
        ]
        draw.polygon(pants_pts, fill=(191, 197, 208, 255), outline=stroke_rgb, width=2)
        
        # (4) 양팔 (피부색)
        # 뒷팔
        draw.polygon([(int(22*2.33)+210, int(56*2.33)+70), (int(38*2.33)+210, int(50*2.33)+70), (int(44*2.33)+210, int(70*2.33)+70), (int(30*2.33)+210, int(76*2.33)+70)], fill=skin_rgb, outline=stroke_rgb, width=2)
        # 앞팔
        draw.polygon([(int(-18*2.33)+210, int(56*2.33)+70), (int(-10*2.33)+210, int(70*2.33)+70), (int(4*2.33)+210, int(82*2.33)+70), (int(14*2.33)+210, int(76*2.33)+70), (int(12*2.33)+210, int(64*2.33)+70), (int(0*2.33)+210, int(58*2.33)+70)], fill=skin_rgb, outline=stroke_rgb, width=2)

        img.save(f"assets/img/body-bat-skin{s_idx + 1}.webp", "WEBP")
    print("Created: 5 body sheets.")

    # ==========================================
    # 6. 장비 (18장)
    # ==========================================
    poses = ["bat"] # 타격 기본
    for pose in poses:
        # (1) cleats (신발 3종)
        cleats_colors = [(59, 130, 246, 255), (239, 68, 68, 255), (251, 191, 36, 255)] # 블루, 레드, 골드
        for lvl in range(1, 4):
            img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            col = cleats_colors[lvl - 1]
            stroke_rgb = (17, 17, 17, 255)
            # 신발 위치: x_left = -14*2.33+210, x_right = 14*2.33+210, y = 174*2.33+70
            xl, yl = int(-14 * 2.33) + 210, int(174 * 2.33) + 70
            xr, yr = int(14 * 2.33) + 210, int(174 * 2.33) + 70
            rx, ry = int(11 * 2.33), int(5 * 2.33)
            # 왼쪽 신발
            draw.ellipse([xl - rx, yl - ry, xl + rx, yl + ry], fill=col, outline=stroke_rgb, width=2)
            # 오른쪽 신발
            draw.ellipse([xr - rx, yr - ry, xr + rx, yr + ry], fill=col, outline=stroke_rgb, width=2)
            img.save(f"assets/img/eq-cleats-lvl{lvl}-{pose}.webp", "WEBP")

        # (2) glove (글러브 장갑 3종)
        glove_colors = [(78, 164, 255, 255), (30, 41, 59, 255), (251, 191, 36, 255)] # 블루, 네이비, 골드
        for lvl in range(1, 4):
            img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            col = glove_colors[lvl - 1]
            stroke_rgb = (17, 17, 17, 255)
            # 손 위치: 뒷손(37,73), 앞손(9,79)
            x1, y1 = int(37 * 2.33) + 210, int(73 * 2.33) + 70
            x2, y2 = int(9 * 2.33) + 210, int(79 * 2.33) + 70
            r = int(6 * 2.33)
            # 뒷손 장갑
            draw.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=col, outline=stroke_rgb, width=2)
            # 앞손 장갑
            draw.ellipse([x2 - r, y2 - r, x2 + r, y2 + r], fill=col, outline=stroke_rgb, width=2)
            img.save(f"assets/img/eq-glove-lvl{lvl}-{pose}.webp", "WEBP")

        # (3) bat (배트 3종)
        bat_colors = [(200, 200, 200, 255), (30, 41, 59, 255), (251, 191, 36, 255)] # 실버, 다크, 골드
        for lvl in range(1, 4):
            img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            col = bat_colors[lvl - 1]
            stroke_rgb = (17, 17, 17, 255)
            # 배트 라인: (38,56)에서 (78,-2)
            x1, y1 = int(38 * 2.33) + 210, int(56 * 2.33) + 70
            x2, y2 = int(78 * 2.33) + 210, int(-2 * 2.33) + 70
            w = int(5.5 * 2.33)
            draw.line([x1, y1, x2, y2], fill=col, width=w, joint="round")
            # 배트 윤곽선(검은 테두리 대신 라운드 캡 마개)
            draw.ellipse([x2 - w//2, y2 - w//2, x2 + w//2, y2 + w//2], fill=col, outline=stroke_rgb, width=2)
            img.save(f"assets/img/eq-bat-lvl{lvl}-{pose}.webp", "WEBP")
            
    print("Created: 18 equipment variants.")
    print("All 75 layered assets successfully generated!")

if __name__ == '__main__':
    build_all_assets()
