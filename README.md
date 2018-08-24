# Movie Gifstasy

This application allows you to explore gifs based on movies. There is a row of buttons at the top which, when clicked, will 
retrieve 10 fresh gifs from Giphy related to the title on the button. Pressing the button again will get you 10 more new gifs. 

New buttons can be added by typing in movie titles in the box on the right and clicking the Add Button button. You will see
the new button at the end of the row, and clicking it will retrieve 10 wonderful gifs related to the movie you just entered.

The gifs are still when they load, but clicking on the image will cause them to play. Clicking on them again will cause them
to stop playing.

You can select favorites and they will move to the favorites section on the right of the screen. These favorites will always be
here for you as long as you use the same browser on the same computer, even if you shut down your browser and come back later.

Once you tire of a favorite, you can click the Remove button and it will vanish!

There are also download buttons, but due to cross-origin resource sharing being disabled by modern browsers, the download button
will actually open your selected gif in a new window, where you can right click it and save it to your device.

Have fun and be careful, this app will make you gifstatic!!

This was an exercise in using ajax and APIs. I also used localStorage for the favorites section.

https://geoffreygo.github.io/Giftastic/
