# Export Social icons from Figma to Tailwind code

**How it works:**
1. Create each social icon as one flattened layer with no groups etc.
2. Ensure the layer is named as the lowercase name of the social network, e.g. facebook, twitter, linkedin
3. Ensure all icons are on the same canvas size, with the path positioned within that canvas
4. Ensure all icons are inline on either the X or Y-axis.
5. Select all paths you'd like to export, then right-click and run the plugin. Choose your options & click Export.
6. 🎉

It will magically generate the icon sizing & fill colours for you, as well as the direction of the icons (using Tailwind flex) and the spacing between them (using Tailwind margins).
