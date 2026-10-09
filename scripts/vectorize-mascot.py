#!/usr/bin/env python3
"""
Pipeline Automatizado de Vetorização de Mascotes — Auramath
Converte conceitos raster (PNG/JPG) em SVGs vetoriais puros de alta fidelidade
utilizando o motor VTracer (Rust/Bézier splines) com pós-processamento de transparência.

Uso:
  python scripts/vectorize-mascot.py                      # Converte todas as imagens em public/mascot/concepts/
  python scripts/vectorize-mascot.py path/to/image.png    # Converte uma imagem específica
"""

import sys
import os
import re
import vtracer
from pathlib import Path

# Garante suporte a UTF-8 no Windows para emojis e caracteres acentuados
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
CONCEPTS_DIR = ROOT_DIR / "public" / "mascot" / "concepts"
OUTPUT_DIR = ROOT_DIR / "public" / "mascot"


def clean_and_optimize_svg(svg_content: str) -> str:
    """
    Pós-processa o SVG gerado pelo VTracer:
    1. Garante viewBox="0 0 1024 1024" responsivo.
    2. Remove width/height fixos para adaptação CSS fluida.
    3. Remove caminhos que cobrem a tela inteira com fundo branco/quase branco.
    """
    # 1. Garante viewBox="0 0 1024 1024" e remove width/height rígidos
    def normalize_svg_tag(match):
        tag = match.group(0)
        tag = re.sub(r'\s+width="[^"]*"', '', tag)
        tag = re.sub(r'\s+height="[^"]*"', '', tag)
        if 'viewBox' not in tag:
            # Insere viewBox antes do fechamento '>'
            tag = tag[:-1].rstrip() + ' viewBox="0 0 1024 1024">'
        return tag

    svg_content = re.sub(r'<svg[^>]*>', normalize_svg_tag, svg_content, count=1)

    # 2. Remove retângulos de fundo branco cobrindo 1024x1024
    # Padrão típico do VTracer para fundo sólido: path cobrindo (0 0) a (1024 1024) com #FEFEFE ou #FFFFFF
    lines = svg_content.splitlines()
    cleaned_lines = []

    for line in lines:
        is_bg_path = False
        # Se for um path com preenchimento branco/off-white que contém os 4 cantos da tela
        if ('#fefefe' in line.lower() or '#ffffff' in line.lower() or '#fdfdfd' in line.lower()) and 'd="M0 0' in line:
            if '1024' in line or '1023' in line:
                is_bg_path = True

        if not is_bg_path:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines)


def vectorize_image(image_path: Path, output_path: Path) -> bool:
    """
    Converte uma imagem raster em SVG vetorial de alta definição.
    """
    print(f"🎨 Vetorizando: {image_path.name} -> {output_path.name}...")

    temp_svg = output_path.with_suffix(".tmp.svg")

    try:
        # Executa a vetorização com splines cúbicas de alta fidelidade
        # Usando os parâmetros otimizados padrões do VTracer (Rust)
        vtracer.convert_image_to_svg_py(
            str(image_path.resolve()),
            str(temp_svg.resolve())
        )

        with open(temp_svg, "r", encoding="utf-8") as f:
            content = f.read()

        cleaned = clean_and_optimize_svg(content)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(cleaned)

        if temp_svg.exists():
            temp_svg.unlink()

        size_kb = output_path.stat().st_size / 1024
        print(f"✨ Concluído com sucesso! Gerado: {output_path.name} ({size_kb:.1f} KB)")
        return True

    except Exception as e:
        print(f"❌ Erro ao vetorizar {image_path.name}: {e}")
        if temp_svg.exists():
            temp_svg.unlink()
        return False


def find_concept_file(query: str):
    """
    Localiza um arquivo de conceito por caminho absoluto, relativo ou apenas o nome da pose.
    Ex: 'prisma-idle', 'prisma-idle.jpg', 'public/mascot/concepts/prisma-idle.jpg'
    """
    # 1. Caminho direto
    direct = Path(query)
    if direct.exists() and direct.is_file():
        return direct.resolve()

    # 2. Busca na pasta de conceitos por nome exato
    concept_exact = CONCEPTS_DIR / query
    if concept_exact.exists() and concept_exact.is_file():
        return concept_exact.resolve()

    # 3. Busca por stem (sem extensão)
    valid_exts = [".jpg", ".jpeg", ".png", ".webp"]
    for ext in valid_exts:
        candidate = CONCEPTS_DIR / f"{query}{ext}"
        if candidate.exists():
            return candidate.resolve()

    # 4. Busca se o usuário passou com prefixo public/
    rel_path = ROOT_DIR / query
    if rel_path.exists() and rel_path.is_file():
        return rel_path.resolve()

    return None


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CONCEPTS_DIR.mkdir(parents=True, exist_ok=True)

    args = sys.argv[1:]

    # Help
    if any(arg in ["-h", "--help"] for arg in args):
        print("🦎 Pipeline de Vetorização do Mascote — Auramath")
        print("\nUso:")
        print("  npm run mascot:vectorize -- <nome-da-pose>   # Vetoriza SOMENTE uma imagem individual")
        print("  npm run mascot:vectorize                    # Modo seguro incremental (só processa imagens novas)")
        print("  npm run mascot:vectorize -- --force         # Força a regeração de todas as poses")
        print("\nExemplos:")
        print("  npm run mascot:vectorize -- prisma-eureka")
        print("  npm run mascot:vectorize -- prisma-nova-pose.png")
        sys.exit(0)

    force_all = any(arg in ["--force", "-f"] for arg in args)
    target_args = [arg for arg in args if arg not in ["--force", "-f"]]

    # 1. Modo Individual: usuário especificou uma imagem individual para vetorizar
    if target_args:
        target_query = target_args[0]
        found_file = find_concept_file(target_query)

        if not found_file:
            print(f"❌ Imagem não encontrada: '{target_query}'")
            print(f"💡 Verifique se o arquivo está na pasta {CONCEPTS_DIR}")
            print(f"   Arquivos disponíveis:")
            for p in sorted(CONCEPTS_DIR.iterdir()):
                if p.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]:
                    print(f"   - {p.stem} ({p.name})")
            sys.exit(1)

        dest_name = found_file.stem + ".svg"
        dest_path = OUTPUT_DIR / dest_name
        print(f"🎯 Modo Individual: Vetorizando apenas '{found_file.name}' (as demais poses permanecerão intocadas)...")
        success = vectorize_image(found_file, dest_path)
        if success:
            print(f"✅ Concluído! O arquivo '{dest_name}' foi gerado/atualizado com sucesso.")
        sys.exit(0 if success else 1)

    # 2. Modo em Lote / Incremental
    valid_exts = {".jpg", ".jpeg", ".png", ".webp"}
    images = [p for p in CONCEPTS_DIR.iterdir() if p.suffix.lower() in valid_exts]

    if not images:
        print(f"ℹ️ Nenhuma imagem encontrada em {CONCEPTS_DIR}")
        print("💡 Coloque suas imagens (JPG/PNG) nessa pasta e execute novamente!")
        sys.exit(0)

    print(f"🔍 Verificando {len(images)} imagens conceituais...")
    count_generated = 0
    count_skipped = 0

    for img in sorted(images):
        svg_name = img.stem + ".svg"
        out_svg = OUTPUT_DIR / svg_name

        # Proteção contra sobrescrita: se o SVG já existe e não foi passado --force, pula!
        if out_svg.exists() and not force_all:
            print(f"🛡️  [PRESERVADO] {svg_name} já existe e está protegido. Pulei para não alterar.")
            count_skipped += 1
            continue

        if vectorize_image(img, out_svg):
            count_generated += 1

    print("\n📊 Resumo do Pipeline:")
    print(f"   ✨ SVGs novos/atualizados: {count_generated}")
    print(f"   🛡️  SVGs preservados intactos: {count_skipped}")
    if count_skipped > 0:
        print("💡 Dica: Para atualizar uma pose específica sem tocar nas outras, use:")
        print("   npm run mascot:vectorize -- <nome-da-pose> (ex: npm run mascot:vectorize -- prisma-idle)")


if __name__ == "__main__":
    main()
