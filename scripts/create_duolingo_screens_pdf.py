# -*- coding: utf-8 -*-
"""
Script: scripts/create_duolingo_screens_pdf.py
Gera um único PDF contendo todas as 1.103 imagens da pasta duolingo_screens_imagens,
organizado por seções com capa e índice de marcadores (bookmarks/TOC).
"""

import os
import sys
import time
import pymupdf

WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IMAGE_DIR = os.path.join(WORKSPACE_ROOT, "duolingo_screens_imagens")
OUTPUT_PDF = os.path.join(WORKSPACE_ROOT, "DUOLINGO_SCREENS_COMPLETO.pdf")

def main():
    print("=" * 70)
    print("COMPILADOR DE TELAS DUOLINGO — AURAMATH")
    print(f"Diretório de Origem: {IMAGE_DIR}")
    print(f"Arquivo PDF de Destino: {OUTPUT_PDF}")
    print("=" * 70)

    if not os.path.exists(IMAGE_DIR):
        print(f"ERRO: Diretório não encontrado: {IMAGE_DIR}")
        sys.exit(1)

    all_files = sorted([f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(".png")])
    total_images = len(all_files)
    print(f"Total de imagens encontradas: {total_images}")

    flow_files = [f for f in all_files if "-flow-" in f]
    mobbin_files = [f for f in all_files if "-mobbin-" in f]
    other_files = [f for f in all_files if f not in flow_files and f not in mobbin_files]

    print(f" - Telas de Fluxo (Flow): {len(flow_files)}")
    print(f" - Telas de Interface (Mobbin): {len(mobbin_files)}")
    if other_files:
        print(f" - Outras Telas: {len(other_files)}")

    ordered_files = flow_files + mobbin_files + other_files

    t0 = time.time()
    doc = pymupdf.open()

    # --------------------------------------------------------------------------
    # 1. Capa Oficial do Acervo
    # --------------------------------------------------------------------------
    print("Criando capa oficial do acervo...")
    cover = doc.new_page(width=1179, height=2556)

    # Fundo Paper #F7F4EA
    cover.draw_rect(pymupdf.Rect(0, 0, 1179, 2556), color=None, fill=(0.968, 0.957, 0.918))

    # Moldura Externa Verdigris #176B5B
    cover.draw_rect(pymupdf.Rect(50, 50, 1129, 2506), color=(0.090, 0.420, 0.357), width=6)
    # Moldura Interna Grafite
    cover.draw_rect(pymupdf.Rect(66, 66, 1113, 2490), color=(0.76, 0.74, 0.68), width=2)

    # Wordmark / Header
    cover.insert_textbox(
        pymupdf.Rect(100, 300, 1079, 450),
        "aura●math",
        fontsize=46,
        fontname="helv",
        color=(0.125, 0.145, 0.133),
        align=pymupdf.TEXT_ALIGN_CENTER,
    )

    # Título Principal
    cover.insert_textbox(
        pymupdf.Rect(100, 580, 1079, 900),
        "DUOLINGO\nREFERENCE SCREENS",
        fontsize=68,
        fontname="helv",
        color=(0.090, 0.420, 0.357),
        align=pymupdf.TEXT_ALIGN_CENTER,
    )

    # Subtítulo e Descrição
    cover.insert_textbox(
        pymupdf.Rect(120, 960, 1059, 1300),
        f"Acervo Integral de Telas de Referência de UI, UX e Fluxos\n"
        f"Total Consolidado: {total_images:,} Telas em Alta Resolução (1179 × 2556 px)\n\n"
        f"• Seção 1: Telas de Fluxo (Flows) — {len(flow_files):,} imagens\n"
        f"• Seção 2: Telas de Interface (Mobbin UI) — {len(mobbin_files):,} imagens\n\n"
        f"Metáfora e Engenharia Reversa Visual para o Auramath Rebrand 01.1",
        fontsize=28,
        fontname="helv",
        color=(0.20, 0.22, 0.21),
        align=pymupdf.TEXT_ALIGN_CENTER,
    )

    # Rodapé Metadados
    cover.insert_textbox(
        pymupdf.Rect(120, 2200, 1059, 2400),
        "Projeto Auramath — Cálculo Mental como Descoberta\n"
        "Ambiente de Referência de Design e Gamificação • Outubro de 2026",
        fontsize=22,
        fontname="helv",
        color=(0.40, 0.44, 0.42),
        align=pymupdf.TEXT_ALIGN_CENTER,
    )

    # --------------------------------------------------------------------------
    # 2. Inserção das Imagens
    # --------------------------------------------------------------------------
    print("Iniciando inserção de páginas...")
    current_page = 2  # Capa é página 1

    flow_start_page = current_page
    mobbin_start_page = flow_start_page + len(flow_files)

    for idx, f in enumerate(ordered_files, start=1):
        img_path = os.path.join(IMAGE_DIR, f)
        try:
            imgdoc = pymupdf.open(img_path)
            pdfbytes = imgdoc.convert_to_pdf()
            imgdoc.close()

            imgpdf = pymupdf.open("pdf", pdfbytes)
            doc.insert_pdf(imgpdf)
            imgpdf.close()
        except Exception as e:
            print(f"Erro ao processar {f}: {e}")

        if idx % 100 == 0 or idx == total_images:
            elapsed = time.time() - t0
            rate = idx / elapsed
            remaining = (total_images - idx) / rate if rate > 0 else 0
            print(f"[{idx}/{total_images}] {idx/total_images*100:.1f}% concluído "
                  f"({rate:.1f} imgs/s, ~{remaining:.0f}s restantes)...")

    # --------------------------------------------------------------------------
    # 3. Criação dos Marcadores / Tabela de Conteúdo (TOC)
    # --------------------------------------------------------------------------
    print("Criando marcadores de navegação (Bookmarks/TOC)...")
    toc = [
        [1, "Capa do Acervo & Metadados", 1],
        [1, f"Seção 1: Telas de Fluxo (Flows) — {len(flow_files)} telas", flow_start_page],
        [1, f"Seção 2: Telas de Interface (Mobbin UI) — {len(mobbin_files)} telas", mobbin_start_page],
    ]
    doc.set_toc(toc)

    # --------------------------------------------------------------------------
    # 4. Salvamento Otimizado
    # --------------------------------------------------------------------------
    print("Gravando arquivo PDF final no disco (com compressão deflate)...")
    doc.save(OUTPUT_PDF, deflate=True, garbage=3)
    doc.close()

    total_time = time.time() - t0
    final_size = os.path.getsize(OUTPUT_PDF)

    print("=" * 70)
    print("PDF GERADO COM SUCESSO!")
    print(f"Arquivo: {OUTPUT_PDF}")
    print(f"Total de Páginas: {total_images + 1}")
    print(f"Tamanho Final: {final_size:,} bytes ({final_size / (1024*1024):.2f} MB)")
    print(f"Tempo Total de Processamento: {total_time:.1f} segundos")
    print("=" * 70)

if __name__ == "__main__":
    main()
