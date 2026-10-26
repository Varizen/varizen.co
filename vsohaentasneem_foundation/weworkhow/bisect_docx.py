# -*- coding: utf-8 -*-
"""Bisect which feature corrupts the DOCX for Word."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_meeting_minutes as B
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn

OUT = B.ROOT

def variant(name, fn):
    doc = Document()
    fn(doc)
    path = os.path.join(OUT, f"bisect_{name}.docx")
    doc.save(path)
    print("built", path)

def v_base(doc):
    doc.add_paragraph("base only")

def v_style(doc):
    st = doc.styles["Normal"]
    st.font.name = B.EN
    st.font.size = Pt(10)
    st.font.color.rgb = RGBColor.from_string(B.INK)
    stRpr = st.element.get_or_add_rPr()
    stF = stRpr.get_or_add_rFonts()
    stF.set(qn("w:cs"), B.BN)
    stF.set(qn("w:eastAsia"), B.BN)
    doc.add_paragraph("style test")

def v_section(doc):
    sec = doc.sections[0]
    sec.page_width = Cm(21.0); sec.page_height = Cm(29.7)
    sec.top_margin = Cm(1.3); sec.bottom_margin = Cm(1.7)
    sec.left_margin = Cm(1.6); sec.right_margin = Cm(1.6)
    sec.different_first_page_header_footer = True
    doc.add_paragraph("section test")

def v_headers(doc):
    v_section(doc)
    B.build_footer(doc.sections[0].footer)
    B.build_footer(doc.sections[0].first_page_footer)
    doc.add_paragraph("headers/footers test")

def v_watermark(doc):
    v_section(doc)
    wm = B.make_watermark_png()
    h = doc.sections[0].first_page_header
    h.is_linked_to_previous = False
    B.add_watermark(h.paragraphs[0], wm, 8.6, 9001)
    doc.add_paragraph("watermark test")

def v_field(doc):
    p = doc.add_paragraph()
    B.add_field(p, "PAGE")
    doc.add_paragraph("field test")

def v_table(doc):
    t = doc.add_table(rows=2, cols=2)
    B.fix_layout(t, [4.0, 4.0])
    B.table_borders(t, B.STONE, 4)
    B.cell_margins(t)
    B.shade_cell(t.rows[0].cells[0], B.NAVY)
    B.row_height(t.rows[0], 0.95)
    B.no_split(t.rows[0])
    B.repeat_header(t.rows[0])
    B.label_cell(t.rows[0].cells[0], "Label", "লেবেল")
    doc.add_paragraph("table test")

def v_masthead(doc):
    B.build()  # full doc already built separately; here just masthead-like
    return

variant("base", v_base)
variant("style", v_style)
variant("section", v_section)
variant("headers", v_headers)
variant("watermark", v_watermark)
variant("field", v_field)
variant("table", v_table)
print("done")
