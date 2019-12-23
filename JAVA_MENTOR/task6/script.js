navigation_menu__block=document.querySelector('.navigation-menu__block')
document.querySelector('.navigation-menu-scroller-control__checkbox')
.addEventListener("change",function(){
    navigation_menu__block.classList.toggle('navigation-menu__block--full')
})

if(document.documentElement.clientWidth < 641) {
navigation_menu__block_items=navigation_menu__block .children
for(let i=0;i<navigation_menu__block_items.length;i++) {
    navigation_menu__block_items[i].className ='swiper-slide'
}
navigation_menu__block.className='swiper-wrapper'
var mySwiper = new Swiper ('.navigation-menu__swiper-container', {
// Optional parameters
direction: 'horizontal',
loop: true,

// If we need pagination
pagination: {
el: '.navigation-menu__swiper-pagination'
}
})
}