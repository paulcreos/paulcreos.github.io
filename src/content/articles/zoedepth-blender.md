---
title: 'Workflow with ZoeDepth and Blender'
description: A step-by-step workflow for turning a two-dimensional image into a detailed relief using ZoeDepth, depth maps, and Blender.
date: 2025-10-18
author: 'Paul Creos'
category: technology

---

In the era of AI-driven creativity, blending cutting-edge depth estimation with powerful 3D tools unlocks a world of possibilities in digital fabrication. Enter ZoeDepth—a state-of-the-art AI model for monocular depth estimation—and Blender, the free, open-source 3D powerhouse. Together, they let you morph any flat 2D image into a tactile 3D relief, perfect for CNC milling, 3D printing, architectural prototypes, or even cinematic VFX.

This streamlined workflow empowers artists, makers, and designers to prototype physical forms in minutes, bridging the gap between digital sketches and real-world objects. Whether you're sculpting a custom sign or visualizing a product concept, here's how to nail it step by step.

## Phase 1: Crafting the Depth Map with ZoeDepth
ZoeDepth shines in monocular depth estimation, inferring spatial depth from a single image by analyzing cues like perspective, shading, and object occlusion—no stereo pairs or sensors required. It's robust across diverse scenes, from portraits to landscapes.


Choose Your Input Image: Start with a high-res 2D photo (at least 1024x1024 pixels) featuring strong tonal contrasts, sharp edges, and clear subject separation. Avoid overly busy or low-contrast images to minimize AI artifacts.


Run the AI Magic: Load your image into a ZoeDepth interface—options include Hugging Face's online demo, a local Python setup via GitHub (using libraries like Torch and OpenCV), or a quick Google Colab notebook for zero-install testing. The model processes in seconds, outputting a normalized depth prediction.
Here's a minimal Python example to generate the depth map locally (requires Python 3.8+, PyTorch, and ZoeDepth installed via pip install git+https://github.com/isl-org/ZoeDepth.git):

```python
from PIL import Image
from zoe_depth import ZoeDepth

# Initialize the model
zoedepth = ZoeDepth()

# Load your input image
rgb = Image.open("input_image.jpg")  # Replace with your image path

# Infer depth map
depth = zoedepth.infer_pil(rgb)

# Save the depth map (grayscale, normalized)
depth.save("depth_map.png")
print("Depth map saved as depth_map.png")

# Initialize the model
zoedepth = ZoeDepth()

# Load your input image
rgb = Image.open("input_image.jpg")  # Replace with your image path

# Infer depth map
depth = zoedepth.infer_pil(rgb)

# Save the depth map (grayscale, normalized)
depth.save("depth_map.png")
print("Depth map saved as depth_map.png")
```
Note: Run this in a Jupyter notebook or script. The output is a PIL Image; for 16-bit export, convert to NumPy and use imageio if needed: import imageio; imageio.imwrite("depth_map.exr", depth_array, format='EXR').


Refine the Output: You'll get a grayscale depth map where white = nearest (peak height) and black = farthest (valley depth). Tweak parameters like scale or edge enhancement if available to boost accuracy for your scene.


Pro Tip & Export: Save as a 16-bit PNG or OpenEXR (.exr) for lossless fidelity—crucial to avoid banding in subtle gradients. If the map feels noisy, apply a light Gaussian blur in GIMP or Photoshop beforehand.

This phase turns your static image into a "height blueprint," ready for 3D extrusion.

## Phase 2: Sculpting the Relief in Blender
Blender steps in as your digital lathe, converting that abstract depth data into a manipulable mesh. No prior expertise? Blender's intuitive modifiers make it beginner-friendly.


Set Up the Canvas: Fire up a new Blender scene (default units: meters). Add a Plane (Shift+A > Mesh > Plane) and scale it to match your depth map's aspect ratio (e.g., via the Dimensions panel in Object Properties).


Boost Resolution: In Edit Mode (Tab key), select all (A) and subdivide (right-click > Subdivide) 4–6 times for a dense grid—aim for 512x512 faces minimum. Alternatively, stack a Subdivision Surface modifier for adaptive smoothing without manual hassle.


Apply Displacement for Depth:

Back in Object Mode, add a Displace modifier (Modifiers tab > Add Modifier > Displace).
Under Texture, click "New" > select Image Texture > load your depth map.
Set Direction to Z (for vertical extrusion) and dial Strength to your desired max height (e.g., 0.05m for a subtle relief or 0.2m for dramatic peaks).
Enable "Midlevel" at 0.5 for balanced extrusion around the plane's center.

Automate this with Blender's Python API (run in the Scripting workspace or Text Editor):
```python
import bpy
import bmesh

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Add and prepare plane
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, 0))
plane = bpy.context.active_object
plane.name = "ReliefPlane"

# Subdivide for detail (5 cuts for ~32x32 grid; increase for more)
bpy.context.view_layer.objects.active = plane
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.subdivide(number_cuts=5)
bpy.ops.object.mode_set(mode='OBJECT')

# Add Displace modifier
displace_mod = plane.modifiers.new(name="Displace", type='DISPLACE')
displace_mod.strength = 0.1  # Adjust max height here
displace_mod.direction = 'Z'
displace_mod.mid_level = 0.5

# Load depth map as texture
tex = bpy.data.textures.new(name="DepthTexture", type='IMAGE')
img = bpy.data.images.load(filepath="/path/to/depth_map.png")  # Update path
tex.image = img
displace_mod.texture = tex

print("Displacement applied! Render or export to preview.")
```

Polish It: Add a Smooth Shading or Subdivision Surface modifier on top for organic curves. Preview with Cycles rendering (F12) under a key light to spot issues like inverted depths—flip the map's colors in an image editor if needed.


Your flat plane now breathes as a nuanced 3D topography, deformable like clay.

## Phase 3: Refining for Fabrication-Ready Perfection

Raw AI meshes can be polygon-heavy beasts—tame them for production without sacrificing soul.

Validate Mesh Health: Use Blender's 3D-Print Toolbox addon (enable in Preferences > Add-ons) to check for non-manifold edges, holes, or overlaps. Fix with Merge by Distance (Edit Mode > Mesh > Merge) to ensure it's "watertight."


Decimate Smartly: Apply a Decimate modifier (Planar or Un-Subdivide mode) to slash polys by 50–80% while preserving silhouettes. Target 10k–50k faces for most printers/mills—test with a quick STL export and CAM preview.
Quick Python snippet to add and apply Decimate (append to the previous script):
```python
# Add Decimate modifier (after displacement)
decimate_mod = plane.modifiers.new(name="Decimate", type='DECIMATE')
decimate_mod.ratio = 0.2  # Reduces to 20% polys; adjust as needed
decimate_mod.decimate_type = 'COLLAPSE'  # Or 'UNSUBDIVIDE' for grids

# Apply all modifiers for export
bpy.ops.object.select_all(action='DESELECT')
plane.select_set(True)
bpy.context.view_layer.objects.active = plane
bpy.ops.object.modifier_apply(modifier="Displace")
bpy.ops.object.modifier_apply(modifier="Decimate")

print("Mesh optimized and modifiers applied.")
```

Scale & Orient: Align to your build volume (e.g., XY plane for flat-bed milling). Apply real-world units: Scale tool + Object > Apply > All Transforms. For multi-sided reliefs, duplicate and mirror as needed.


Export Mastery:

CNC Milling: STL or OBJ with quads triangulated—import into Fusion 360 or Mastercam for toolpathing. Add a base thickness (Extrude tool) for structural integrity.
3D Printing: STL sliced in Cura/PrusaSlicer; orient face-up to minimize supports.
Bonus: VFX/Prototyping: Alembic (.abc) for animation-friendly exports.

Python for exporting (add at script end):
```python
# Export as STL for printing/milling
bpy.ops.export_mesh.stl(filepath="/path/to/relief.stl", use_selection=True)

# Or OBJ
bpy.ops.export_scene.obj(filepath="/path/to/relief.obj", use_selection=True)

print("Model exported!")
```

By fusing ZoeDepth's perceptive AI with Blender's sculpting finesse, you're not just converting images—you're democratizing fabrication. Experiment with layered maps for multi-height reliefs or batch-process folders for production runs. The result? Hyper-detailed, custom objects that feel handcrafted. Dive in, iterate, and watch your 2D visions rise into the third dimension.
