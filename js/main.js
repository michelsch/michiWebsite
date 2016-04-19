$(".scroll").click(function () {
  $('html,body').animate({
      scrollTop: $(document).height()/3,
  }, 1000);
});
