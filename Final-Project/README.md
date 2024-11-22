## Project Overview

I plan to create a text-to-3d model generator, along with a previewer for the generated model. 
It will have a text box, where the user will describe what the model should be of, then the user will click **Generate**.
Behind the scenes, a preview model (less geometry and no textures) will be generated, and the status of model generation will be updated on
the screen. Once done, the preview model will be shown. If the user is happy with the preview, they will initiate a *Refine* task, which will 
generate more detailed geometry and apply textures. Upon completion of the refined model, it will be shown in the 3d previewer, where the user can 
rotate the camera around the model, inspect it's final state, and download as **.glb** if desired.

This sounds like a lot, but I've already got both the model generation and previewer functioning separately in the directory **/FinalProject**.
I am using three.js for the model previewer, and Meshy AI API for the model generation. 

## Project Schedule

- ***Week 1*** - Finish creating UI elements for model generation and model download.
- ***Week 2-3*** - Integrate model generation with model previewer.
- ***Week 4*** - Finishing touches. Polish UI, include animations where it fits.

## Project Technical Requirements

I will be using JavaScript, three.js, and Meshy AI API. More technologies may be required, but I believe this is all I will need.
