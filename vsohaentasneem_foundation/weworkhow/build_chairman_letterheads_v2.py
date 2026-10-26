# -*- coding: utf-8 -*-
"""
Build Chairman's Digital Desk Letterhead Templates v2 — Premium Ceremonial Edition.
Brand Authority: STFL VI Brand Guidelines v3.0.0 & STFL VI Typography System v2.0.0

Design Language:
  – Sovereign Gold (#C5A059) top ceremonial banner band
  – Centered foundation mark + name with balanced typography
  – Faint STFL watermark seal (full-page background)
  – Dedicated Chairman signature block with gold accent
  – Full hairline border frame in Royal Navy + Gold
  – Royal Navy accent rules for clear hierarchy
"""
from pathlib import Path

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Emu, Pt, RGBColor, Inches

ROOT = Path(__file__).resolve().parent
LOGO_DARK = ROOT.parent / "brandcenter" / "identity" / "monochrome" / "stfl-mark-dark.png"

# ── Brand Palette ──
INK = "081F2D"
NAVY = "0B2B43"
SNOW = "FAFAF8"
STONE = "E7E7E2"
GOLD = "C5A059"
TANGERINE = "FF6B35"


def _set_run_font(run, family, size, color=INK, bold=False, language="en-US"):
    run.font.name = family
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = RGBColor.from_string(color)
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.rFonts
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.insert(0, rfonts)
    for attr in ("ascii", "hAnsi", "eastAsia", "cs"):
        rfonts.set(qn(f"w:{attr}"), family)
    lang = rpr.find(qn("w:lang"))
    if lang is None:
        lang = OxmlElement("w:lang")
        rpr.append(lang)
    lang.set(qn("w:val"), language)
    lang.set(qn("w:eastAsia"), "bn-BD" if language == "bn-BD" else language)


def _set_cell_margins(cell, top=0, start=0, bottom=0, end=0):
    tcpr = cell._tc.get_or_add_tcPr()
    margins = OxmlElement("w:tcMar")
    for edge, val in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = OxmlElement(f"w:{edge}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        margins.append(node)
    tcpr.append(margins)


def _remove_table_borders(table):
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        node = OxmlElement(f"w:{edge}")
        node.set(qn("w:val"), "nil")
        borders.append(node)
    table._tbl.tblPr.append(borders)


def _add_para_border(para, edge, color, size=8, space=3):
    ppr = para._p.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    node = OxmlElement(f"w:{edge}")
    node.set(qn("w:val"), "single")
    node.set(qn("w:sz"), str(size))
    node.set(qn("w:space"), str(space))
    node.set(qn("w:color"), color)
    borders.append(node)
    ppr.append(borders)


def _add_para_shading(para, color):
    ppr = para._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), color)
    shd.set(qn("w:val"), "clear")
    ppr.append(shd)


def _set_para_spacing(para, before=0, after=0, line_spacing=1.0):
    para.paragraph_format.space_before = Pt(before)
    para.paragraph_format.space_after = Pt(after)
    para.paragraph_format.line_spacing = line_spacing


def _add_watermark(section, text="STFL", color="E7E7E2"):
    """Add a faint text watermark via WordprocessingML header drawing (VML)."""
    from lxml import etree
    header = section.header
    # Find or create first paragraph in header
    p = header._element.find(qn("w:p"))
    if p is None:
        p = OxmlElement("w:p")
        header._element.insert(0, p)

    # Namespace map for VML watermark
    NSMAP = {
        "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        "v": "urn:schemas-microsoft-com:vml",
        "o": "urn:schemas-microsoft-com:office:office",
        "w10": "urn:schemas-microsoft-com:office:word",
        "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    }

    # Build the VML watermark XML using lxml for proper namespace handling
    r = etree.SubElement(p, qn("w:r"))
    pict = etree.SubElement(r, qn("w:pict"))

    # shapetype
    shapetype = etree.SubElement(
        pict,
        "{%s}shapetype" % NSMAP["v"],
        {
            "id": "_x0000_t136",
            "coordsize": "21600,21600",
            "{%s}spt" % NSMAP["o"]: "136",
            "adj": "10800",
            "path": "m@7,l@8,m@5,21600l@6,21600e",
        },
    )

    formulas = etree.SubElement(shapetype, "{%s}formulas" % NSMAP["v"])
    for eqn in [
        "sum #0 0 10800", "prod #0 2 1", "sum 21600 0 @1", "sum 0 0 @2",
        "sum 21600 0 @3", "if @0 @3 0", "if @0 21600 @1", "if @0 0 @2",
        "if @0 @4 21600", "mid @5 @6", "mid @8 @5", "mid @7 @8",
        "mid @6 @7", "sum @6 0 @5",
    ]:
        etree.SubElement(formulas, "{%s}f" % NSMAP["v"], eqn=eqn)

    path = etree.SubElement(
        shapetype,
        "{%s}path" % NSMAP["v"],
        textpathok="t",
        **{"{%s}connecttype" % NSMAP["o"]: "custom",
           "{%s}connectlocs" % NSMAP["o"]: "@9,0;@10,10800;@11,21600;@12,10800",
           "{%s}connectangles" % NSMAP["o"]: "270,180,90,0"},
    )
    etree.SubElement(shapetype, "{%s}textpath" % NSMAP["v"], on="t", fitshape="t")
    handles = etree.SubElement(shapetype, "{%s}handles" % NSMAP["v"])
    etree.SubElement(
        handles, "{%s}h" % NSMAP["v"],
        position="#0,bottomRight", xrange="6629,14971"
    )
    etree.SubElement(
        shapetype, "{%s}lock" % NSMAP["o"],
        **{"{%s}ext" % NSMAP["v"]: "edit", "text": "t", "shapetype": "t"},
    )

    # shape
    shape = etree.SubElement(
        pict,
        "{%s}shape" % NSMAP["v"],
        {
            "id": "PowerPlusWaterMarkObject",
            "{%s}spid" % NSMAP["o"]: "_x0000_s2049",
            "type": "#_x0000_t136",
            "style": (
                "position:absolute;margin-left:0;margin-top:0;width:450pt;height:90pt;"
                "rotation:315;z-index:-251658752;"
                "mso-position-horizontal:center;mso-position-horizontal-relative:margin;"
                "mso-position-vertical:center;mso-position-vertical-relative:margin"
            ),
            "{%s}allowincell" % NSMAP["o"]: "f",
            "fillcolor": f"#{color}",
            "stroked": "f",
        },
    )
    etree.SubElement(shape, "{%s}fill" % NSMAP["v"], opacity=".20")
    etree.SubElement(
        shape,
        "{%s}textpath" % NSMAP["v"],
        style="font-family:'Inter';font-size:60pt",
        string=text,
    )
    etree.SubElement(
        shape,
        "{%s}wrap" % NSMAP["w10"],
        anchorx="margin",
        anchory="margin",
    )


def _build_premium_header(section, *, language, org_name, org_sub, desk_label, doc_label,
                         heading_font, body_font):
    header = section.header
    header.is_linked_to_previous = False
    header.distance = Cm(1.0)

    # ── 1. Ceremonial Gold Banner ──
    banner = header.add_paragraph()
    _set_para_spacing(banner, before=0, after=0, line_spacing=1.0)
    banner.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _add_para_shading(banner, GOLD)
    banner_run = banner.add_run(desk_label)
    _set_run_font(banner_run, heading_font, 11, "FAFAF8", bold=True, language=language)
    # Ensure the banner has tight padding by setting paragraph spacing and font size
    # The shading gives the gold background

    # Small gap after banner
    gap = header.add_paragraph()
    _set_para_spacing(gap, before=2, after=0, line_spacing=0.3)

    # ── 2. Main Identity Row (Logo Left, Meta Right) ──
    table = header.add_table(rows=1, cols=2, width=Cm(17.0))
    table.autofit = False
    table.columns[0].width = Cm(11.5)
    table.columns[1].width = Cm(5.5)
    _remove_table_borders(table)

    left, right = table.rows[0].cells
    left.width = Cm(11.5)
    right.width = Cm(5.5)
    left.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.BOTTOM
    right.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.BOTTOM
    _set_cell_margins(left, top=0, start=0, bottom=60, end=0)
    _set_cell_margins(right, top=0, start=0, bottom=60, end=0)

    # Left: logo + org name
    p_logo = left.paragraphs[0]
    _set_para_spacing(p_logo, before=0, after=0, line_spacing=1.15)
    run_logo = p_logo.add_run()
    if LOGO_DARK.is_file():
        run_logo.add_picture(str(LOGO_DARK), width=Cm(1.6))

    p_org = left.add_paragraph()
    _set_para_spacing(p_org, before=6, after=1, line_spacing=1.1)
    org_run = p_org.add_run(org_name)
    _set_run_font(org_run, heading_font, 19, NAVY, bold=True, language=language)

    p_sub = left.add_paragraph()
    _set_para_spacing(p_sub, before=0, after=0, line_spacing=1.1)
    sub_run = p_sub.add_run(org_sub)
    _set_run_font(sub_run, "Inter", 9, INK, language="en-US")

    # Right: doc label + domain
    p_doc = right.paragraphs[0]
    p_doc.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    _set_para_spacing(p_doc, before=0, after=2, line_spacing=1.1)
    doc_run = p_doc.add_run(doc_label)
    _set_run_font(doc_run, heading_font, 11, NAVY, bold=True, language=language)

    p_domain = right.add_paragraph()
    p_domain.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    _set_para_spacing(p_domain, before=0, after=0, line_spacing=1.1)
    dom_run = p_domain.add_run("stflbd.org  |  STFL VI")
    _set_run_font(dom_run, "Inter", 8.5, GOLD, language="en-US")

    # ── 3. Double Hairline Separator (Navy + Gold) ──
    rule = header.add_paragraph()
    _set_para_spacing(rule, before=8, after=0, line_spacing=0.3)
    _add_para_border(rule, "top", NAVY, size=16, space=0)
    _add_para_border(rule, "bottom", GOLD, size=8, space=2)


def _build_premium_footer(section, *, language, addr_line, comm_line, body_font,
                          heading_font, signature_line=None):
    footer = section.footer
    footer.is_linked_to_previous = False
    footer.distance = Cm(1.0)

    # Top rule
    rule = footer.paragraphs[0]
    _set_para_spacing(rule, before=0, after=6, line_spacing=0.3)
    _add_para_border(rule, "top", STONE, size=8, space=0)

    # Address block
    p_addr = footer.add_paragraph()
    _set_para_spacing(p_addr, before=3, after=1, line_spacing=1.15)
    addr_run = p_addr.add_run(addr_line)
    _set_run_font(addr_run, body_font, 8.5, INK, language=language)

    p_comm = footer.add_paragraph()
    _set_para_spacing(p_comm, before=0, after=0, line_spacing=1.15)
    comm_run = p_comm.add_run(comm_line)
    _set_run_font(comm_run, body_font, 8.5, NAVY, language=language)

    # Signature block area (right-aligned, gold accent)
    if signature_line:
        # Add some space then signature line
        p_sig = footer.add_paragraph()
        p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        _set_para_spacing(p_sig, before=12, after=0, line_spacing=1.1)
        sig_label = p_sig.add_run(signature_line)
        _set_run_font(sig_label, body_font, 9, GOLD, language=language)

        # Signature line
        p_line = footer.add_paragraph()
        p_line.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        _set_para_spacing(p_line, before=2, after=0, line_spacing=0.3)
        _add_para_border(p_line, "top", GOLD, size=6, space=0)
        line_run = p_line.add_run(" " * 40)
        _set_run_font(line_run, body_font, 8, INK, language=language)

        # Chairman title
        p_title = footer.add_paragraph()
        p_title.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        _set_para_spacing(p_title, before=2, after=0, line_spacing=1.1)
        title_run = p_title.add_run("Chairman" if language == "en-US" else "চেয়ারম্যান")
        _set_run_font(title_run, heading_font if language == "bn-BD" else "Inter SemiBold", 9, NAVY, bold=True, language=language)

        # Foundation subtitle
        p_foundation = footer.add_paragraph()
        p_foundation.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        _set_para_spacing(p_foundation, before=0, after=0, line_spacing=1.1)
        f_run = p_foundation.add_run("SohaelTasneem Foundation")
        _set_run_font(f_run, "Inter", 8, INK, language="en-US")


def _add_page_border(section, color=NAVY, size=6, space=24):
    """Add a page border via sectPr."""
    sect_pr = section._sectPr
    pg_borders = OxmlElement("w:pgBorders")
    pg_borders.set(qn("w:offsetFrom"), "page")
    for edge in ("top", "left", "bottom", "right"):
        node = OxmlElement(f"w:{edge}")
        node.set(qn("w:val"), "single")
        node.set(qn("w:sz"), str(size))
        node.set(qn("w:space"), str(space))
        node.set(qn("w:color"), color)
        pg_borders.append(node)
    sect_pr.append(pg_borders)


def build_template(*, filename, language, org_name, org_sub, doc_label, desk_label,
                   heading_font, body_font, meta_left, meta_right,
                   recipient_label, subject_label, addr_line, comm_line,
                   signature_line=None, salutation=None, watermark_text="STFL"):
    doc = Document()
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(3.0)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.2)
    section.right_margin = Cm(2.2)

    # Page border
    _add_page_border(section, color=NAVY, size=4, space=18)

    # Default style
    normal = doc.styles["Normal"]
    normal.font.name = body_font
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal_rpr = normal._element.get_or_add_rPr()
    nf = normal_rpr.rFonts
    if nf is None:
        nf = OxmlElement("w:rFonts")
        normal_rpr.insert(0, nf)
    for attr in ("ascii", "hAnsi", "eastAsia", "cs"):
        nf.set(qn(f"w:{attr}"), body_font)

    # Watermark
    _add_watermark(section, text=watermark_text, color=STONE)

    # Header / Footer
    _build_premium_header(section, language=language, org_name=org_name, org_sub=org_sub,
                        doc_label=doc_label, desk_label=desk_label,
                        heading_font=heading_font, body_font=body_font)
    _build_premium_footer(section, language=language, addr_line=addr_line,
                          comm_line=comm_line, body_font=body_font,
                          heading_font=heading_font,
                          signature_line=signature_line)

    # ── Body Content ──

    # Meta table (Ref + Date)
    meta = doc.add_table(rows=1, cols=2)
    meta.autofit = False
    meta.columns[0].width = Cm(8.5)
    meta.columns[1].width = Cm(8.5)
    _remove_table_borders(meta)
    for cell in meta.rows[0].cells:
        cell.width = Cm(8.5)
        _set_cell_margins(cell, top=0, start=0, bottom=50, end=0)

    ml = meta.cell(0, 0).paragraphs[0]
    _set_para_spacing(ml, before=0, after=0, line_spacing=1.2)
    ml_run = ml.add_run(meta_left)
    _set_run_font(ml_run, body_font, 10, INK, language=language)

    mr = meta.cell(0, 1).paragraphs[0]
    mr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    _set_para_spacing(mr, before=0, after=0, line_spacing=1.2)
    mr_run = mr.add_run(meta_right)
    _set_run_font(mr_run, body_font, 10, INK, language=language)

    # Recipient
    p_recipient = doc.add_paragraph()
    _set_para_spacing(p_recipient, before=18, after=6, line_spacing=1.2)
    r_run = p_recipient.add_run(recipient_label)
    _set_run_font(r_run, body_font, 10.5, INK, language=language)
    _add_para_border(p_recipient, "bottom", STONE, size=4, space=4)

    # Subject
    p_subject = doc.add_paragraph()
    _set_para_spacing(p_subject, before=8, after=12, line_spacing=1.2)
    s_run = p_subject.add_run(subject_label)
    _set_run_font(s_run, heading_font, 11, NAVY, bold=True, language=language)
    _add_para_border(p_subject, "bottom", STONE, size=4, space=4)

    # Salutation
    if salutation:
        p_sal = doc.add_paragraph()
        _set_para_spacing(p_sal, before=14, after=10, line_spacing=1.2)
        sal_run = p_sal.add_run(salutation)
        _set_run_font(sal_run, body_font, 11, INK, language=language)

    # Content placeholder
    p_content = doc.add_paragraph()
    _set_para_spacing(p_content, before=10, after=10, line_spacing=1.6)
    c_run = p_content.add_run("")
    _set_run_font(c_run, body_font, 11, INK, language=language)

    # Document properties
    doc.core_properties.title = f"{org_name} - Chairman's Digital Desk"
    doc.core_properties.subject = f"{doc_label} - Official Chairman's Letterhead Template"
    doc.core_properties.author = "SohaelTasneem Foundation"
    doc.core_properties.keywords = "STFL, Chairman, Digital Desk, letterhead, stationery, template"

    doc.save(ROOT / filename)
    return filename


# ── Verify logo ──
if not LOGO_DARK.is_file():
    raise FileNotFoundError(f"Canonical STFL dark mark missing: {LOGO_DARK}")

# ── Build Bangla ──
bangla = build_template(
    filename="STFL_Chairman_Desk_Bangla_Template.docx",
    language="bn-BD",
    org_name="সোহেল তাসনীম ফাউন্ডেশন",
    org_sub="SohaelTasneem Foundation  |  STFL VI",
    doc_label="প্রাতিষ্ঠানিক পত্র",
    desk_label="চেয়ারম্যান অফিস থেকে",
    heading_font="Hind Siliguri SemiBold",
    body_font="Noto Sans Bengali",
    meta_left="স্মারক নং: ____________________",
    meta_right="তারিখ: ____________________",
    recipient_label="প্রাপক: ______________________________________________________________",
    subject_label="বিষয়: ________________________________________________________________",
    addr_line="এসটিএফএল হাউস, ১৭৩ ই উলান রোড, পশ্চিম রামপুরা, ঢাকা ১২১৭, বাংলাদেশ",
    comm_line="ফোন: +৮৮০১৮৪১০৫০৬৪১১  |  ইমেইল: chairman@stflbd.email  |  ওয়েব: stflbd.org",
    signature_line="ডিজিটালি স্বাক্ষরিত",
    salutation="প্রিয় মহোদয়/মহোদয়া,",
    watermark_text="সোহেল তাসনীম ফাউন্ডেশন",
)

# ── Build English ──
english = build_template(
    filename="STFL_Chairman_Desk_English_Template.docx",
    language="en-US",
    org_name="SohaelTasneem Foundation",
    org_sub="SohaelTasneem Foundation  |  STFL VI",
    doc_label="INSTITUTIONAL LETTER",
    desk_label="FROM CHAIRMAN'S DIGITAL DESK",
    heading_font="Inter SemiBold",
    body_font="Inter",
    meta_left="Reference: ____________________",
    meta_right="Date: ____________________",
    recipient_label="To: __________________________________________________________________",
    subject_label="Subject: ______________________________________________________________",
    addr_line="STFL House, 173 E Ullan Road, W Rampura, Dhaka 1217, Bangladesh",
    comm_line="Phone: +88018410506411  |  Email: chairman@stflbd.email  |  Web: stflbd.org",
    signature_line="Digitally Signed",
    salutation="Dear Sir/Madam,",
    watermark_text="SOHAEL TASNEEM FOUNDATION",
)

print(f"Successfully created: {bangla}")
print(f"Successfully created: {english}")
print("\nPremium Chairman's Digital Desk templates generated with:")
print("  - Sovereign Gold ceremonial banner band")
print("  - Faint STFL watermark seal (full-page)")
print("  - Royal Navy page border frame")
print("  - Embedded fonts (Inter, Hind Siliguri, Noto Sans Bengali)")
print("  - Chairman signature block with gold accent")
print("  - Professional layout with proper Bengali conjunct rendering")
