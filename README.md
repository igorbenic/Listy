ibenicSlider
============

Responsive List Slider - 2kb minifed, 6kb production!

<div id="about" class="container">
<div class="page-header">
<h1>About</h1>
</div>
<p>
<strong>ibenicSlider</strong> is a <em>responsive list slider</em>. After developing a site which has multiple sliders that show a list I tried to use Bootstrap 3`s carousel.
</p>
<p>Everything worked fine until I wanted some nice responsive way to show those lists on smaller devices without changing the size of them because then the images were too small.
After few lines of code I decided to build my own List Slider.
</p>
<p>
My goal was to have a slider which would slide a number of items, show only a number of items and change the number of shown and sliding items on resize/smaller device viewports.
Style independant so we can style it how we want.
</p>
<h2>License</h2>
<p>This jQuery plugin can be used both on personal and commercial projects</p>
</div>
<div id="usage" class="container">
<div class="page-header">
<h1>Usage</h1>
</div>
<p>It is really easy to set it. The slider calculates the width of the container by computing the number of items we want to show with the width of the list items (checks the first item in the list).</p>
<p>This is a list slider so we use only UL, for now.</p>
<pre>
$(selector).ibenicSlider({
/*Defaults*/
itemNo: 3, //Number of items to show
itemSlideNo: 1, //Number of items to slide
handleLeft: '.goLeft', //Control to slide left
handleRight: '.goRight',//Control to slide right
container: null, //if we want an upper container so we can easily customize the position with CSS, set it to a selector such as "#container"
resize: true //this is default, if we dont want any resize we set it to false
});
</pre>
</div>

div class="page-header">
<h1>Examples</h1>
</div>
<p>
They can be viewed on the demo site: http://igorbenic.github.io/ibenicSlider/#example
</p>

</div>
