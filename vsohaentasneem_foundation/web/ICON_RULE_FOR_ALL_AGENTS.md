# STFL — MANDATORY ICON RULE FOR ALL DEVELOPERS AND AGENTS

STOP.

Before adding or modifying any interface icon in STFL, read:

`STFL_ICONOGRAPHY_POLICY.md`

## Single source

The only approved UI icon source is:

https://iconoir.com/

## Web implementation

Use:

`iconoir-react`

## Absolute rule

DO NOT install or use another icon library.

DO NOT create a replacement icon.

DO NOT copy an SVG icon from another website.

DO NOT use random SVG icons.

DO NOT use emoji as interface icons.

DO NOT use text characters such as:
→
←
×
☰
♥

as substitutes for interface icons when an Iconoir icon exists.

## Approved

STFL logo and official brand artwork are separate from interface icons.

## Before coding

Search Iconoir first.

If an appropriate icon exists, use it.

If no suitable icon exists, do NOT introduce another icon library.
Escalate the missing-icon requirement instead.

## Verification

Run:

`npm run verify:icons`

before considering icon-related work complete.

Production builds automatically run the icon policy check.

## Final principle

ONE ICON SYSTEM.

ICONOIR ONLY.
