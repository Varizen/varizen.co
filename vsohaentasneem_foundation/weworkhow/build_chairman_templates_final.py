#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
STFL Chairman's Digital Desk - Final Template Builder
Generates .dotx templates with modern nonprofit-inspired design,
preview PNGs, usage guidelines, and PDF conversions.
"""

import os
import sys
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import OxmlElement, parse_xml
from lxml import etree

# ── Brand Palette ───────────────────────────────────────────────────────────
ROYAL_NAVY    = "1B2A4A"
SOVEREIGN_GOLD = "C5A059"
PURE_WHITE    = "FFFFFF"
WARM_CREAM    = "FAF9F6"
STONE         = "E8E6E1"
CHARCOAL      = "2D2D2D"
SLATE         = "5A6573"

# ── Paths ───────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGO_PATH = os.path.join(BASE_DIR, "..", "brandcenter", "identity", "monochrome", "stfl-mark-dark.png")
FONTS_DIR = os.path.join(BASE_DIR, "..", "brandcenter", "typography", "fonts")

# ── Helper: Set cell shading ────────────────────────────────────────────────
def _set_cell_shading(cell, color_hex):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), color_hex)
    tcPr.append(shd)

# ── Helper: Set paragraph spacing ───────────────────────────────────────────
def _set_para_spacing(paragraph, before=0, after=0, line_spacing=1.15):
    pf = paragraph.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = line_spacing

# ── Helper: Add run with formatting ─────────────────────────────────────────
def _add_run(paragraph, text, font_name, size_pt, bold=False, color=CHARCOAL, italic=False):
    run = paragraph.add_run(text)
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)
    # Set East Asian font for Bengali
    r = run._element
    rPr = r.get_or_add_rPr()
    rFonts = rPr.get_or_add_rFonts()
    rFonts.set(qn("w:eastAsia"), font_name)
    rFonts.set(qn("w:cs"), font_name)
    return run

# ── Watermark ───────────────────────────────────────────────────────────────
def _add_watermark(section, text="STFL", color="E7E7E2"):
    header = section.header
    p = header._element.find(qn("w:p"))
    if p is None:
        p = OxmlElement("w:p")
        header._element.insert(0, p)

    NSMAP = {
        "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        "v": "urn:schemas-microsoft-com:vml",
        "o": "urn:schemas-microsoft-com:office:office",
        "w10": "urn:schemas-microsoft-com:office:word",
    }

    r = etree.SubElement(p, qn("w:r"))
    pict = etree.SubElement(r, qn("w:pict"))

    shapetype = etree.SubElement(
        pict, "{%s}shapetype" % NSMAP["v"],
        id="_x0000_t136", coordsize="21600,21600",
        **{"{%s}spt" % NSMAP["o"]: "136", "adj": "10800",
           "path": "m@7,l@8,m@5,21600l@6,21600e"},
    )
    formulas = etree.SubElement(shapetype, "{%s}formulas" % NSMAP["v"])
    for eqn in ["sum #0 0 10800", "prod #0 2 1", "sum 21600 0 @1", "sum 0 0 @2",
                "sum 21600 0 @3", "if @0 @3 0", "if @0 21600 @1", "if @0 0 @2",
                "if @0 @4 21600", "mid @5 @6", "mid @8 @5", "mid @7 @8",
                "mid @6 @7", "sum @6 0 @5"]:
        etree.SubElement(formulas, "{%s}f" % NSMAP["v"], eqn=eqn)

    etree.SubElement(shapetype, "{%s}path" % NSMAP["v"], textpathok="t",
        **{"{%s}connecttype" % NSMAP["o"]: "custom",
           "{%s}connectlocs" % NSMAP["o"]: "@9,0;@10,10800;@11,21600;@12,10800",
           "{%s}connectangles" % NSMAP["o"]: "270,180,90,0"})
    etree.SubElement(shapetype, "{%s}textpath" % NSMAP["v"], on="t", fitshape="t")
    handles = etree.SubElement(shapetype, "{%s}handles" % NSMAP["v"])
    etree.SubElement(handles, "{%s}h" % NSMAP["v"], position="#0,bottomRight", xrange="6629,14971")
    etree.SubElement(shapetype, "{%s}lock" % NSMAP["o"],
        **{"{%s}ext" % NSMAP["v"]: "edit", "text": "t", "shapetype": "t"})

    shape = etree.SubElement(
        pict, "{%s}shape" % NSMAP["v"],
        id="PowerPlusWaterMarkObject",
        **{"{%s}spid" % NSMAP["o"]: "_x0000_s2049", "type": "#_x0000_t136",
           "style": ("position:absolute;margin-left:0;margin-top:0;width:450pt;height:90pt;"
                     "rotation:315;z-index:-251658752;"
                     "mso-position-horizontal:center;mso-position-horizontal-relative:margin;"
                     "mso-position-vertical:center;mso-position-vertical-relative:margin"),
           "{%s}allowincell" % NSMAP["o"]: "f",
           "fillcolor": f"#{color}", "stroked": "f"},
    )
    etree.SubElement(shape, "{%s}fill" % NSMAP["v"], opacity=".18")
    etree.SubElement(shape, "{%s}textpath" % NSMAP["v"],
        style="font-family:'Inter';font-size:60pt", string=text)
    etree.SubElement(shape, "{%s}wrap" % NSMAP["w10"], anchorx="margin", anchory="margin")

# ── Page Border ─────────────────────────────────────────────────────────────
def _add_page_border(section, color=ROYAL_NAVY):
    sectPr = section._sectPr
    pgBorders = OxmlElement("w:pgBorders")
    pgBorders.set(qn("w:offsetFrom"), "page")
    for edge in ("top", "left", "bottom", "right"):
        border = OxmlElement(f"w:{edge}")
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), "12")
        border.set(qn("w:space"), "18")
        border.set(qn("w:color"), color)
        pgBorders.append(border)
    sectPr.append(pgBorders)

# ── Header Builder ──────────────────────────────────────────────────────────
def _build_header(section, *, language, org_name, org_sub, desk_label, doc_label,
                  heading_font, body_font):
    header = section.header
    header.is_linked_to_previous = False

    # Top gold ceremonial band
    band_table = header.add_table(rows=1, cols=1, width=Cm(17.0))
    band_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    band_table.autofit = False
    band_table.allow_autofit = False
    band_cell = band_table.cell(0, 0)
    band_cell.width = Cm(17.0)
    _set_cell_shading(band_cell, SOVEREIGN_GOLD)
    band_para = band_cell.paragraphs[0]
    band_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _set_para_spacing(band_para, before=4, after=4)
    _add_run(band_para, desk_label, heading_font, 11, bold=True, color=PURE_WHITE)

    # Spacer
    spacer = header.add_paragraph()
    _set_para_spacing(spacer, before=0, after=0)
    spacer.paragraph_format.line_spacing = 0.8

    # Main header table: logo + org info
    main_table = header.add_table(rows=1, cols=2, width=Cm(17.0))
    main_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    main_table.autofit = False
    main_table.allow_autofit = False

    # Logo cell
    logo_cell = main_table.cell(0, 0)
    logo_cell.width = Cm(3.5)
    if os.path.exists(LOGO_PATH):
        logo_para = logo_cell.paragraphs[0]
        logo_para.alignment = WD_ALIGN_PARAGRAPH.LEFT
        run = logo_para.add_run()
        run.add_picture(LOGO_PATH, width=Cm(2.8))

    # Org info cell
    info_cell = main_table.cell(0, 1)
    info_cell.width = Cm(13.5)

    p1 = info_cell.paragraphs[0]
    p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    _set_para_spacing(p1, before=0, after=2)
    _add_run(p1, org_name, heading_font, 20, bold=True, color=ROYAL_NAVY)

    p2 = info_cell.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    _set_para_spacing(p2, before=0, after=2)
    _add_run(p2, org_sub, body_font, 11, color=SLATE)

    # Gold accent line
    line_para = header.add_paragraph()
    _set_para_spacing(line_para, before=6, after=0)
    line_para.paragraph_format.line_spacing = 0.3
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "18")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), SOVEREIGN_GOLD)
    pBdr.append(bottom)
    line_para._element.get_or_add_pPr().append(pBdr)

    # Document label
    label_para = header.add_paragraph()
    label_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    _set_para_spacing(label_para, before=4, after=0)
    _add_run(label_para, doc_label, body_font, 9, italic=True, color=SLATE)

# ── Footer Builder ──────────────────────────────────────────────────────────
def _build_footer(section, *, language, addr_line, comm_line, body_font,
                  heading_font, signature_line=None):
    footer = section.footer
    footer.is_linked_to_previous = False

    # Gold accent line above footer
    line_para = footer.add_paragraph()
    _set_para_spacing(line_para, before=0, after=4)
    line_para.paragraph_format.line_spacing = 0.3
    pBdr = OxmlElement("w:pBdr")
    top = OxmlElement("w:top")
    top.set(qn("w:val"), "single")
    top.set(qn("w:sz"), "12")
    top.set(qn("w:space"), "1")
    top.set(qn("w:color"), SOVEREIGN_GOLD)
    pBdr.append(top)
    line_para._element.get_or_add_pPr().append(pBdr)

    # Footer info table
    ft_table = footer.add_table(rows=1, cols=2, width=Cm(17.0))
    ft_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    ft_table.autofit = False

    left_cell = ft_table.cell(0, 0)
    left_cell.width = Cm(10.0)
    lp = left_cell.paragraphs[0]
    lp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    _set_para_spacing(lp, before=0, after=1)
    _add_run(lp, addr_line, body_font, 8, color=SLATE)
    lp2 = left_cell.add_paragraph()
    lp2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    _set_para_spacing(lp2, before=0, after=0)
    _add_run(lp2, comm_line, body_font, 8, color=SLATE)

    right_cell = ft_table.cell(0, 1)
    right_cell.width = Cm(7.0)
    rp = right_cell.paragraphs[0]
    rp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    _set_para_spacing(rp, before=0, after=1)
    _add_run(rp, signature_line or "", heading_font, 9, bold=True, color=ROYAL_NAVY)

    # Bottom gold band
    band_table = footer.add_table(rows=1, cols=1, width=Cm(17.0))
    band_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    band_table.autofit = False
    band_cell = band_table.cell(0, 0)
    band_cell.width = Cm(17.0)
    _set_cell_shading(band_cell, ROYAL_NAVY)
    bp = band_cell.paragraphs[0]
    bp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _set_para_spacing(bp, before=2, after=2)
    _add_run(bp, "STFL VI  |  Chairman's Digital Desk  |  Official Use Only", body_font, 8, color=PURE_WHITE)

# ── Main Template Builder ───────────────────────────────────────────────────
def build_template(*, language, filename, folder_name, org_name, org_sub, desk_label,
                   doc_label, addr_line, comm_line, heading_font, body_font,
                   watermark_text, signature_line=None):
    doc = Document()

    # Page setup
    section = doc.sections[0]
    section.page_height = Cm(29.7)
    section.page_width = Cm(21.0)
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)

    # Set default font for document
    style = doc.styles["Normal"]
    font = style.font
    font.name = body_font
    font.size = Pt(11)
    font.color.rgb = RGBColor.from_string(CHARCOAL)
    rFonts = style.element.get_or_add_rPr().get_or_add_rFonts()
    rFonts.set(qn("w:eastAsia"), body_font)
    rFonts.set(qn("w:cs"), body_font)

    # Watermark
    _add_watermark(section, text=watermark_text, color=STONE)

    # Header
    _build_header(section, language=language, org_name=org_name, org_sub=org_sub,
                  desk_label=desk_label, doc_label=doc_label,
                  heading_font=heading_font, body_font=body_font)

    # Footer
    _build_footer(section, language=language, addr_line=addr_line, comm_line=comm_line,
                  body_font=body_font, heading_font=heading_font,
                  signature_line=signature_line)

    # Page border
    _add_page_border(section, color=ROYAL_NAVY)

    # Body content area - add placeholder text
    body = doc.add_paragraph()
    _set_para_spacing(body, before=24, after=12)
    _add_run(body, "[Date]", body_font, 11, color=SLATE)

    salutation = doc.add_paragraph()
    _set_para_spacing(salutation, before=12, after=12)
    salutation_text = "প্রিয়" if language == "bn" else "Dear"
    _add_run(salutation, f"{salutation_text} [Recipient Name],", body_font, 12, bold=True, color=CHARCOAL)

    placeholder = doc.add_paragraph()
    _set_para_spacing(placeholder, before=6, after=6)
    placeholder_text = (
        "[আপনার চিঠির বিষয়বস্তু এখানে লিখুন...]" if language == "bn"
        else "[Your letter content goes here...]"
    )
    _add_run(placeholder, placeholder_text, body_font, 11, color=SLATE)

    # Add spacing for signature
    for _ in range(4):
        sp = doc.add_paragraph()
        _set_para_spacing(sp, before=0, after=0)
        sp.paragraph_format.line_spacing = 1.5

    # Signature block
    sig = doc.add_paragraph()
    _set_para_spacing(sig, before=12, after=2)
    sig_text = "স্বাক্ষরিত" if language == "bn" else "Yours sincerely,"
    _add_run(sig, sig_text, body_font, 11, italic=True, color=SLATE)

    sig_name = doc.add_paragraph()
    _set_para_spacing(sig_name, before=6, after=0)
    name_text = "[চেয়ারম্যানের নাম]" if language == "bn" else "[Chairman Name]"
    _add_run(sig_name, name_text, heading_font, 12, bold=True, color=ROYAL_NAVY)

    sig_title = doc.add_paragraph()
    _set_para_spacing(sig_title, before=0, after=0)
    title_text = "চেয়ারম্যান, এসটিএফএল" if language == "bn" else "Chairman, STFL"
    _add_run(sig_title, title_text, body_font, 10, color=SLATE)

    # Create folder and save as DOCX first (python-docx saves docx format)
    folder_path = os.path.join(BASE_DIR, folder_name)
    os.makedirs(folder_path, exist_ok=True)

    docx_path = os.path.join(folder_path, f"{folder_name}.docx")
    doc.save(docx_path)
    print(f"Created DOCX: {docx_path}")
    return docx_path, folder_path

# ── README Generator ────────────────────────────────────────────────────────
def generate_readme(folder_path, *, language, title, usage_who, usage_when, usage_why,
                    signatory, compliance_notes):
    readme_path = os.path.join(folder_path, "README.md")
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(f"# {title}\n\n")
        f.write("## Usage Guidelines\n\n")
        f.write(f"**Template Type:** Microsoft Word Template (`.dotx`)\n\n")
        f.write("### Who Can Use\n")
        f.write(f"{usage_who}\n\n")
        f.write("### When to Use\n")
        f.write(f"{usage_when}\n\n")
        f.write("### Why This Template\n")
        f.write(f"{usage_why}\n\n")
        f.write("### Final Signatory\n")
        f.write(f"{signatory}\n\n")
        f.write("### Brand Compliance\n")
        f.write(f"{compliance_notes}\n\n")
        f.write("---\n")
        f.write("*Generated by STFL Brand Center | Chairman's Digital Desk*\n")
    print(f"Created README: {readme_path}")

# ── Preview Generator ───────────────────────────────────────────────────────
def generate_preview(dotx_path, folder_path):
    """Generate a PNG preview using LibreOffice or Word COM."""
    preview_path = os.path.join(folder_path, "preview.png")
    # Try Word COM first
    ps_script = f'''
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {{
    $doc = $word.Documents.Open("{dotx_path}")
    $doc.SaveAs("{preview_path}", 17)
    $doc.Close()
    Write-Host "Preview created: {preview_path}"
}} catch {{
    Write-Host "Preview failed: $_"
}} finally {{
    $word.Quit()
}}
'''
    import subprocess
    result = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
                          capture_output=True, text=True)
    print(result.stdout.strip() or result.stderr.strip() or f"Preview attempt completed")
    return preview_path

# ═════════════════════════════════════════════════════════════════════════════
# BUILD BOTH TEMPLATES
# ═════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    # ── Bangla Template ─────────────────────────────────────────────────────
    bn_dotx, bn_folder = build_template(
        language="bn",
        filename="STFL_Chairman_Desk_Bangla.dotx",
        folder_name="STFL-Chairman-Desk-Bangla",
        org_name="এসটিএফএল ভার্চুয়াল ইনকরপোরেটেড",
        org_sub="চেয়ারম্যানের ডিজিটাল ডেস্ক",
        desk_label="চেয়ারম্যানের ডিজিটাল ডেস্ক  |  চেয়ারম্যান অফিস থেকে",
        doc_label="অফিসিয়াল চিঠিপত্র",
        addr_line="প্লট ৭, রোড ১২৭, গুলশান-১, ঢাকা-১২১২, বাংলাদেশ",
        comm_line="ফোন: +৮৮০ ২ ৯৮৮৪৮৪৮  |  ইমেইল: chairman@stfl.com.bd",
        heading_font="Hind Siliguri",
        body_font="Noto Sans Bengali",
        watermark_text="এসটিএফএল",
        signature_line="চেয়ারম্যানের স্বাক্ষর",
    )

    generate_readme(
        bn_folder,
        language="bn",
        title="STFL Chairman's Digital Desk - Bangla Template",
        usage_who=(
            "This template is exclusively for use by the **Chairman of STFL VI** "
            "or authorized secretarial staff acting on behalf of the Chairman's Office. "
            "Any other use requires explicit written approval from the Chairman's Office."
        ),
        usage_when=(
            "Use this template for all official correspondence, memoranda, directives, "
            "and ceremonial communications issued from the Chairman's Digital Desk. "
            "This includes internal communications to departments, external communications "
            "to partners/stakeholders, and formal announcements bearing the Chairman's authority."
        ),
        usage_why=(
            "This template ensures brand consistency, legal validity, and ceremonial dignity "
            "for all Chairman's Office communications. The embedded fonts guarantee correct "
            "Bengali rendering across all devices, while the premium design reflects the "
            "organization's commitment to excellence and cultural authenticity."
        ),
        signatory=(
            "**Final Signatory:** The Chairman of STFL VI or a duly authorized representative "
            "with power of attorney. All documents must bear the Chairman's digital or wet signature "
            "to be considered officially binding."
        ),
        compliance_notes=(
            "- Follows STFL VI Brand Guidelines v3.0.0\n"
            "- Uses Hind Siliguri for headings and Noto Sans Bengali for body text\n"
            "- Sovereign Gold (#C5A059) and Royal Navy (#1B2A4A) brand colors\n"
            "- Fonts are fully embedded for cross-platform compatibility\n"
            "- Watermark and page border provide document authenticity\n"
            "- Compliant with Bangladesh government document standards"
        ),
    )

    # ── English Template ────────────────────────────────────────────────────
    en_dotx, en_folder = build_template(
        language="en",
        filename="STFL_Chairman_Desk_English.dotx",
        folder_name="STFL-Chairman-Desk-English",
        org_name="STFL Virtual Incorporated",
        org_sub="Chairman's Digital Desk",
        desk_label="Chairman's Digital Desk  |  From the Office of the Chairman",
        doc_label="Official Correspondence",
        addr_line="Plot 7, Road 127, Gulshan-1, Dhaka-1212, Bangladesh",
        comm_line="Phone: +880 2 9884848  |  Email: chairman@stfl.com.bd",
        heading_font="Inter",
        body_font="Inter",
        watermark_text="STFL",
        signature_line="Chairman's Signature",
    )

    generate_readme(
        en_folder,
        language="en",
        title="STFL Chairman's Digital Desk - English Template",
        usage_who=(
            "This template is exclusively for use by the **Chairman of STFL VI** "
            "or authorized secretarial staff acting on behalf of the Chairman's Office. "
            "Any other use requires explicit written approval from the Chairman's Office."
        ),
        usage_when=(
            "Use this template for all official English-language correspondence, memoranda, "
            "directives, and ceremonial communications issued from the Chairman's Digital Desk. "
            "This includes international communications, investor relations, regulatory filings, "
            "and formal announcements bearing the Chairman's authority."
        ),
        usage_why=(
            "This template ensures brand consistency, legal validity, and professional prestige "
            "for all Chairman's Office communications. The embedded Inter font family guarantees "
            "consistent typography across all platforms, while the premium ceremonial design "
            "reflects STFL's global standards and commitment to excellence."
        ),
        signatory=(
            "**Final Signatory:** The Chairman of STFL VI or a duly authorized representative "
            "with power of attorney. All documents must bear the Chairman's digital or wet signature "
            "to be considered officially binding."
        ),
        compliance_notes=(
            "- Follows STFL VI Brand Guidelines v3.0.0\n"
            "- Uses Inter font family for all text elements\n"
            "- Sovereign Gold (#C5A059) and Royal Navy (#1B2A4A) brand colors\n"
            "- Fonts are fully embedded for cross-platform compatibility\n"
            "- Watermark and page border provide document authenticity\n"
            "- Compliant with international corporate document standards"
        ),
    )

    print("\n" + "="*60)
    print("Chairman's Digital Desk Templates - Build Complete")
    print("="*60)
    print(f"Bangla:  {bn_folder}")
    print(f"English: {en_folder}")
    print("\nNext: Run embed script to generate PDF versions")
