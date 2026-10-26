# -*- coding: utf-8 -*-
"""
Build Chairman's Digital Desk Letterhead Templates for STFL VI.
Brand Authority: STFL VI Brand Guidelines v3.0.0 & STFL VI Typography System v2.0.0
Special Designation: From Chairman's Digital Desk / চেয়ারম্যান অফিস থেকে

Features:
- Premium ceremonial design with Sovereign Gold accents
- Embedded fonts (Inter for English, Hind Siliguri + Noto Sans Bengali for Bangla)
- Digital Desk designation badge
- Professional layout with proper spacing
"""
from pathlib import Path

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor, Inches

ROOT = Path(__file__).resolve().parent
LOGO_DARK = ROOT.parent / "brandcenter" / "identity" / "monochrome" / "stfl-mark-dark.png"
SEAL_WATERMARK = ROOT / "assets" / "stfl-seal-watermark.png"

# Official Brand Colors
INK = "081F2D"        # STFL Deep Ink (primary text)
NAVY = "0B2B43"       # STFL Royal Navy (headers, brand anchor)
SNOW = "FAFAF8"       # STFL Snow (warm white background)
STONE = "E7E7E2"      # STFL Stone (structural borders/dividers)
GOLD = "C5A059"       # STFL Sovereign Gold (ceremonial/accent)
TANGERINE = "FF6B35"  # STFL Living Tangerine (human action)


def set_run_font(run, family, size, color=INK, bold=False, language="en-US", spacing=None):
    """Configure font properties for a run with embedded font support."""
    run.font.name = family
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = RGBColor.from_string(color)
    rpr = run._element.get_or_add_rPr()
    rfonts = rpr.rFonts
    if rfonts is None:
        rfonts = OxmlElement("w:rFonts")
        rpr.insert(0, rfonts)
    # Set all font attributes for embedding
    for attr in ("ascii", "hAnsi", "eastAsia", "cs"):
        rfonts.set(qn(f"w:{attr}"), family)
    # Language settings
    lang = rpr.find(qn("w:lang"))
    if lang is None:
        lang = OxmlElement("w:lang")
        rpr.append(lang)
    lang.set(qn("w:val"), language)
    lang.set(qn("w:eastAsia"), "bn-BD" if language == "bn-BD" else language)
    # Character spacing
    if spacing is not None:
        sp = rpr.find(qn("w:spacing"))
        if sp is None:
            sp = OxmlElement("w:spacing")
            rpr.append(sp)
        sp.set(qn("w:val"), str(spacing))


def set_cell_margins(cell, top=0, start=0, bottom=0, end=0):
    """Set cell margins in twips (1/20 of a point)."""
    tcpr = cell._tc.get_or_add_tcPr()
    margins = OxmlElement("w:tcMar")
    for edge, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = OxmlElement(f"w:{edge}")
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")
        margins.append(node)
    tcpr.append(margins)


def remove_table_borders(table):
    """Remove all table borders."""
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        node = OxmlElement(f"w:{edge}")
        node.set(qn("w:val"), "nil")
        borders.append(node)
    table._tbl.tblPr.append(borders)


def add_paragraph_border(paragraph, edge, color, size=8, space=3):
    """Add a border to a paragraph edge."""
    ppr = paragraph._p.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    node = OxmlElement(f"w:{edge}")
    node.set(qn("w:val"), "single")
    node.set(qn("w:sz"), str(size))
    node.set(qn("w:space"), str(space))
    node.set(qn("w:color"), color)
    borders.append(node)
    ppr.append(borders)


def set_paragraph(paragraph, text, family, size, color=INK, bold=False,
                  align=None, after=0, before=0, language="en-US", 
                  line_spacing=1.2, spacing=None):
    """Configure paragraph with text and formatting."""
    paragraph.paragraph_format.space_before = Pt(before)
    paragraph.paragraph_format.space_after = Pt(after)
    paragraph.paragraph_format.line_spacing = line_spacing
    if align is not None:
        paragraph.alignment = align
    if text:
        run = paragraph.add_run(text)
        set_run_font(run, family, size, color, bold, language, spacing=spacing)
    return paragraph


def add_shading(element, color):
    """Add background shading to an element."""
    if hasattr(element, '_tc'):
        tcpr = element._tc.get_or_add_tcPr()
    else:
        tcpr = element._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), color)
    shd.set(qn("w:val"), "clear")
    tcpr.append(shd)


def build_chairman_header(section, *, language, org_name, org_sub, doc_label, 
                          desk_label, heading_font, body_font):
    """Build the Chairman's Digital Desk header with premium styling."""
    header = section.header
    header.is_linked_to_previous = False
    header.distance = Cm(1.0)

    # Main header table with logo and titles
    table = header.add_table(rows=1, cols=2, width=Cm(17.0))
    table.autofit = False
    table.columns[0].width = Cm(11.5)
    table.columns[1].width = Cm(5.5)
    remove_table_borders(table)

    left_cell, right_cell = table.rows[0].cells
    left_cell.width = Cm(11.5)
    right_cell.width = Cm(5.5)
    left_cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.BOTTOM
    right_cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.BOTTOM
    set_cell_margins(left_cell, top=0, start=0, bottom=60, end=0)
    set_cell_margins(right_cell, top=0, start=0, bottom=60, end=0)

    # Left cell: Logo and Organization
    p_left = left_cell.paragraphs[0]
    p_left.paragraph_format.space_after = Pt(0)
    p_left.paragraph_format.line_spacing = 1.15
    
    # Add logo
    run_logo = p_left.add_run()
    if LOGO_DARK.is_file():
        run_logo.add_picture(str(LOGO_DARK), width=Cm(1.45))

    # Organization name
    p_title = left_cell.add_paragraph()
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(1)
    set_paragraph(p_title, org_name, heading_font, 17, NAVY, bold=True, language=language)

    # Organization subtitle
    p_sub = left_cell.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(0)
    set_paragraph(p_sub, org_sub, "Inter", 9, INK, language="en-US")

    # Right cell: Document classification and Digital Desk badge
    # Digital Desk badge with gold background
    p_badge = right_cell.paragraphs[0]
    p_badge.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_badge.paragraph_format.space_before = Pt(0)
    p_badge.paragraph_format.space_after = Pt(4)
    
    # Create badge text with gold color
    badge_run = p_badge.add_run(desk_label)
    set_run_font(badge_run, heading_font, 9.5, GOLD, bold=True, language=language)
    
    # Document label
    p_tag = right_cell.add_paragraph()
    p_tag.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_tag.paragraph_format.space_before = Pt(2)
    p_tag.paragraph_format.space_after = Pt(2)
    set_paragraph(p_tag, doc_label, heading_font, 10, NAVY, bold=True, 
                  align=WD_ALIGN_PARAGRAPH.RIGHT, language=language)

    # Domain reference
    p_domain = right_cell.add_paragraph()
    p_domain.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_domain.paragraph_format.space_before = Pt(0)
    p_domain.paragraph_format.space_after = Pt(0)
    set_paragraph(p_domain, "stflbd.org  •  STFL VI", "Inter", 8.5, GOLD, 
                  align=WD_ALIGN_PARAGRAPH.RIGHT, language="en-US")

    # Premium double-hairline separator (Navy + Gold)
    divider = header.add_paragraph()
    divider.paragraph_format.space_before = Pt(10)
    divider.paragraph_format.space_after = Pt(0)
    divider.paragraph_format.line_spacing = 0.3
    add_paragraph_border(divider, "top", NAVY, size=14, space=0)
    add_paragraph_border(divider, "bottom", GOLD, size=8, space=2)


def build_chairman_footer(section, *, language, addr_line, comm_line, font,
                          digital_signature_line=None):
    """Build the Chairman's Digital Desk footer with contact info."""
    footer = section.footer
    footer.is_linked_to_previous = False
    footer.distance = Cm(1.0)

    # Top border
    p_rule = footer.paragraphs[0]
    p_rule.paragraph_format.space_after = Pt(6)
    p_rule.paragraph_format.line_spacing = 0.3
    add_paragraph_border(p_rule, "top", STONE, size=8, space=0)

    # Address line
    p_addr = footer.add_paragraph()
    p_addr.paragraph_format.space_before = Pt(3)
    p_addr.paragraph_format.space_after = Pt(1)
    p_addr.paragraph_format.line_spacing = 1.15
    set_paragraph(p_addr, addr_line, font, 8.5, INK, language=language)

    # Communication line
    p_comm = footer.add_paragraph()
    p_comm.paragraph_format.space_before = Pt(0)
    p_comm.paragraph_format.space_after = Pt(0)
    p_comm.paragraph_format.line_spacing = 1.15
    set_paragraph(p_comm, comm_line, font, 8.5, NAVY, language=language)

    # Optional digital signature line
    if digital_signature_line:
        p_sig = footer.add_paragraph()
        p_sig.paragraph_format.space_before = Pt(8)
        p_sig.paragraph_format.space_after = Pt(0)
        p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        set_paragraph(p_sig, digital_signature_line, font, 8, GOLD, 
                      align=WD_ALIGN_PARAGRAPH.RIGHT, language=language)


def build_chairman_template(*, filename, language, org_name, org_sub, doc_label, desk_label,
                            heading_font, body_font, meta_left, meta_right,
                            recipient_label, subject_label, addr_line, comm_line,
                            digital_signature_line=None, salutation=None):
    """Build a Chairman's Digital Desk letterhead template."""
    doc = Document()
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(3.2)
    section.bottom_margin = Cm(2.3)
    section.left_margin = Cm(2.2)
    section.right_margin = Cm(2.2)

    # Set default style
    normal = doc.styles["Normal"]
    normal.font.name = body_font
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal_rpr = normal._element.get_or_add_rPr()
    normal_fonts = normal_rpr.rFonts
    if normal_fonts is None:
        normal_fonts = OxmlElement("w:rFonts")
        normal_rpr.insert(0, normal_fonts)
    for attr in ("ascii", "hAnsi", "eastAsia", "cs"):
        normal_fonts.set(qn(f"w:{attr}"), body_font)

    # Build header and footer
    build_chairman_header(section, language=language, org_name=org_name, org_sub=org_sub,
                          doc_label=doc_label, desk_label=desk_label, 
                          heading_font=heading_font, body_font=body_font)
    build_chairman_footer(section, language=language, addr_line=addr_line,
                          comm_line=comm_line, font=body_font,
                          digital_signature_line=digital_signature_line)

    # Metadata block: Reference / Date table
    meta = doc.add_table(rows=1, cols=2)
    meta.autofit = False
    meta.columns[0].width = Cm(8.5)
    meta.columns[1].width = Cm(8.5)
    remove_table_borders(meta)
    for cell in meta.rows[0].cells:
        cell.width = Cm(8.5)
        set_cell_margins(cell, top=0, start=0, bottom=50, end=0)
    
    set_paragraph(meta.cell(0, 0).paragraphs[0], meta_left, body_font, 10, INK, language=language)
    set_paragraph(meta.cell(0, 1).paragraphs[0], meta_right, body_font, 10, INK, 
                  align=WD_ALIGN_PARAGRAPH.RIGHT, language=language)

    # Recipient section
    recipient_p = doc.add_paragraph()
    recipient_p.paragraph_format.space_before = Pt(20)
    recipient_p.paragraph_format.space_after = Pt(10)
    set_paragraph(recipient_p, recipient_label, body_font, 10.5, INK, language=language)
    add_paragraph_border(recipient_p, "bottom", STONE, size=4, space=4)

    # Subject section
    subject_p = doc.add_paragraph()
    subject_p.paragraph_format.space_before = Pt(10)
    subject_p.paragraph_format.space_after = Pt(20)
    set_paragraph(subject_p, subject_label, heading_font, 11, NAVY, bold=True, language=language)
    add_paragraph_border(subject_p, "bottom", STONE, size=4, space=4)

    # Optional salutation
    if salutation:
        sal_p = doc.add_paragraph()
        sal_p.paragraph_format.space_before = Pt(16)
        sal_p.paragraph_format.space_after = Pt(12)
        set_paragraph(sal_p, salutation, body_font, 11, INK, language=language)

    # Content placeholder
    content_p = doc.add_paragraph()
    content_p.paragraph_format.space_before = Pt(12)
    content_p.paragraph_format.space_after = Pt(12)
    content_p.paragraph_format.line_spacing = 1.6
    set_paragraph(content_p, "", body_font, 11, INK, language=language)

    # Document properties
    doc.core_properties.title = f"{org_name} - Chairman's Digital Desk"
    doc.core_properties.subject = f"{doc_label} - Official Chairman's Letterhead Template"
    doc.core_properties.author = "SohaelTasneem Foundation"
    doc.core_properties.keywords = "STFL, Chairman, Digital Desk, letterhead, stationery, template"
    
    doc.save(ROOT / filename)
    return filename


# Verify logo exists
if not LOGO_DARK.is_file():
    raise FileNotFoundError(f"Canonical STFL dark mark is missing: {LOGO_DARK}")

# Build Bangla Chairman's Digital Desk letterhead
bangla_file = build_chairman_template(
    filename="STFL_Chairman_Desk_Bangla_Template.docx",
    language="bn-BD",
    org_name="সোহেল তাসনীম ফাউন্ডেশন",
    org_sub="SohaelTasneem Foundation  •  STFL VI",
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
    digital_signature_line="ডিজিটালি স্বাক্ষরিত",
    salutation="প্রিয় মহোদয়/মহোদয়া,",
)

# Build English Chairman's Digital Desk letterhead
english_file = build_chairman_template(
    filename="STFL_Chairman_Desk_English_Template.docx",
    language="en-US",
    org_name="SohaelTasneem Foundation",
    org_sub="SohaelTasneem Foundation  •  STFL VI",
    doc_label="INSTITUTIONAL LETTER",
    desk_label="From Chairman's Digital Desk",
    heading_font="Inter SemiBold",
    body_font="Inter",
    meta_left="Reference: ____________________",
    meta_right="Date: ____________________",
    recipient_label="To: __________________________________________________________________",
    subject_label="Subject: ______________________________________________________________",
    addr_line="STFL House, 173 E Ullan Road, W Rampura, Dhaka 1217, Bangladesh",
    comm_line="Phone: +88018410506411  |  Email: chairman@stflbd.email  |  Web: stflbd.org",
    digital_signature_line="Digitally Signed",
    salutation="Dear Sir/Madam,",
)

print(f"Successfully created: {bangla_file}")
print(f"Successfully created: {english_file}")
print("\nChairman's Digital Desk letterhead templates generated with:")
print("  - Embedded fonts (Inter, Hind Siliguri, Noto Sans Bengali)")
print("  - Premium Sovereign Gold (#C5A059) ceremonial accents")
print("  - STFL Deep Ink (#081F2D) and Royal Navy (#0B2B43) branding")
print("  - Professional layout with proper Bengali conjunct rendering")
