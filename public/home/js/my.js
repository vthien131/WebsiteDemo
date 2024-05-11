var is_busy = false;     
// Biến lưu trữ trang hiện tại
var page = 0; 
// Số record trên mỗi trang
var record_per_page = 32; 
// Biến lưu trữ rạng thái phân trang 
var stopped = false;

function currencyFormat(num) {   
  return Math.trunc(num).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

$(document).ready(function(){

	
			
			
    $('.my-button-more').click(function(e){
    	e.preventDefault();    
    	return false;
	});
    
	$('#load_more').click(function(){
        // Element append nội dung
        $element = $('#my_content');
 
        // ELement hiển thị chữ loadding
        $button = $(this);
         
        // Nếu đang gửi ajax thì ngưng
        if (is_busy == true) {
            return false;
        }
         
        // Tăng số trang lên 1
        page++;
 
        // Hiển thị loadding ...
        $button.html('<img src="'+UrlDomain+'public/home/images/loading.gif">');
 
        // Gửi Ajax
        $.ajax(
        {
            type: 'get',
            dataType: 'json',
            url: UrlDomain+'ajaction/load_more',
            data: {page: page, limit:record_per_page},
            success: function(result)
            {
                
				
				var html = '';
				
                // Trường hợp hết dữ liệu cho trang kết tiếp
				
                if (result.length <= record_per_page)
                {
                    // Lặp dữ liêụ
                    $.each(result, function (key, obj){
                        if(obj.product_price_count<2 && obj.product_status == '1'){
                            txtgio = '<div class="add-to-cart">'+
                                        '<a title="Thêm vào giỏ" onclick="tocart(\''+obj.product_id+'_'+obj.price_id+'\',\'1\')" href="javascript:void(0);">'+
                                            '<i class="fa fa-cart-plus"></i>'+
                                        '</a>'+
                                    '</div>';
						}else{
							txtgio = '';
						}
						
						html +='<li class="col-xs-6 col-sm-3">'+
                           '<div class="product-container">'+
                                '<div class="left-block">'+
                                    '<a href="'+obj.dlink+'">'+
										'<img src="'+UrlDomain+'public/upload/product/medium_'+obj.product_image+'" alt="'+obj.product_title+'" class="img-responsive">'+
                                    '</a>'+
                                    '<div class="price-percent-reduction2">-'+obj.percent+'% OFF</div>'+txtgio+
                                '</div>'+
                                '<div class="right-block">'+
                                    '<h3 class="product-name">'+
                                        '<a href="'+obj.dlink+'">'+obj.product_title+'</a>'+
                                    '</h3>'+
                                    '<div class="content_price">'+
                                        '<span class="price product-price">'+currencyFormat(obj.product_price)+'đ</span>'+
                                        '<span class="price old-price">'+currencyFormat(obj.product_price_d)+'đ</span>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</li>';			
                    });
 
                    // Thêm dữ liệu vào danh sách
                    $element.append(html);
 
                    // Xóa button
                    //$button.remove();
					document.getElementById('load_more').style.display = 'none';
                }
                else{ 
					// Trường hợp còn dữ liệu cho trang kế tiếp
                    // Lặp dữ liêụ, trường hợp này ta lặp bỏ đi phần record cuối cùng vì ta selec với limit + 1
                    $.each(result, function (key, obj){
						if (key < result.length - 1){
							if(obj.product_price_count<2 && obj.product_status == '1'){
								txtgio = '<div class="add-to-cart">'+
											'<a title="Thêm vào giỏ" onclick="tocart(\''+obj.product_id+'_'+obj.price_id+'\',\'1\')" href="javascript:void(0);">'+
												'<i class="fa fa-cart-plus"></i>'+
											'</a>'+
										'</div>';
							}else{
								txtgio = '';
							}
							
	                        html +='<li class="col-xs-6 col-sm-3">'+
	                           '<div class="product-container">'+
	                                '<div class="left-block">'+
	                                    '<a href="'+obj.dlink+'">'+
											'<img src="'+UrlDomain+'public/upload/product/medium_'+obj.product_image+'" alt="'+obj.product_title+'" class="img-responsive">'+
	                                    '</a>'+
	                                    '<div class="price-percent-reduction2">-'+obj.percent+'% OFF</div>'+txtgio+
	                                '</div>'+
	                                '<div class="right-block">'+
	                                    '<h3 class="product-name">'+
	                                        '<a href="'+obj.dlink+'">'+obj.product_title+'</a>'+
	                                    '</h3>'+
	                                    '<div class="content_price">'+
	                                        '<span class="price product-price">'+currencyFormat(obj.product_price)+'đ</span>'+
	                                        '<span class="price old-price">'+currencyFormat(obj.product_price_d)+'đ</span>'+
	                                    '</div>'+
	                                '</div>'+
	                            '</div>'+
	                        '</li>';
						}
                    });
 
                    // Thêm dữ liệu vào danh sách
                    $element.append(html);
                }
				
				
 
            }
        })
        .always(function()
        {
            // Sau khi thực hiện xong thì đổi giá trị cho button
            $button.html('XEM THÊM');
            is_busy = false;
        });
 
    });
});



function get_total(type){
	$.post(UrlDomain + "/giohang/get_total",{
		type  : type							                 
	},function(data){
	   if(type=='1'){		   
		  setTimeout(function () {
					$('#cart > button').html('<i class="fa fa-shopping-cart"></i><span id="cart-total">' + data + '</span>');
				}, 100);		   
		   
		  $('html, body').animate({ scrollTop: 0 }, 'slow');
	   }	   
	});
}

function tocart(id,qt) {	
	var cart = $('.shopping-cart');	
	
	$.post(UrlDomain + "/giohang/addcart",{
		id  : id
		,quantity: qt							                 
	},function(data){		
		if(data){		   
		   var msg = '<span style="color:#3c763d; font-size:30px; font-weight:bold;"><i class="fa fa-thumbs-up"></i></span> Bạn đã thêm sản phẩm vào giỏ hàng';
		   $("#my-add-success").html(msg).fadeIn().delay(1000).fadeOut();
		   //get_total('2');
		   get_total('1');	
		   get_short_cart();	   		
	   }else{
		   var msg = '<span style="color:#3c763d; font-size:30px; font-weight:bold;"><i class="fa fa-exclamation-circle"></i></span> Không thêm sản phẩm được vào giỏ hàng. Error ';
		   $("#my-add-success").html(msg).fadeIn().delay(1000).fadeOut();		   
	   }
	});		
	
}

function tocart2(id,qt) {	
	var cart = $('.shopping-cart');	
	var imgtodrag = $('#p'+id).find("img").eq(0);
	if (imgtodrag) {            
		var imgclone = imgtodrag.clone()
		.offset({
			top: imgtodrag.offset().top,
			left: imgtodrag.offset().left
		})
		.css({
			'opacity': '0.5',
			'position': 'absolute',
			'height': '150px',
			'width': '150px',
			'z-index': '100'
		})
		.appendTo($('body'))
		.animate({
			'top': cart.offset().top + 10,
			'left': cart.offset().left + 10,
			'width': 75,
			'height': 75
		}, 1000, 'easeInOutExpo');
				
		setTimeout(function () {
			cart.effect("shake", {
				times: 2
			}, 200);
		}, 1500);
	
		imgclone.animate({
			'width': 0,
			'height': 0
		}, function () {
			$(this).detach()
		});
	}	

	$.post(UrlDomain + "/giohang/addcart",{
		id  : id
		,quantity: qt							                 
	},function(data){
	   if(data){		   
		   var msg = '<span style="color:#3c763d; font-size:30px; font-weight:bold;" class="glyphicon glyphicon-thumbs-up"></span> Bạn đã thêm sản phẩm vào giỏ hàng';
		   $("#success").html(msg).fadeIn().delay(2000).fadeOut();
		   //get_total('2');
		   get_total('1');	
		   get_short_cart();
		   window.location.href = UrlDomain + "/order.html";	   
	   }else{
		   var msg = '<span style="color:#3c763d; font-size:30px; font-weight:bold;" class="glyphicon glyphicon-remove-circle"></span> Không thêm sản phẩm được vào giỏ hàng. Error ';
		   $("#success").html(msg).fadeIn().delay(2000).fadeOut();		   
	   }
	});		
}
			
	
	
	
function addtocart(idsp, t) {
    var cart = $('.cart-image');
    var imgtodrag = $('#box' + idsp + t + '').find("img").eq(0);
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
                .offset({
                    top: imgtodrag.offset().top,
                    left: imgtodrag.offset().left
                })
                .css({
                    'opacity': '0.5',
                    'position': 'absolute',
                    'max-height': '322px',
                    'max-width': '322px',
                    'z-index': '100'
                })
                .appendTo($('body'))
                .animate({
                    'top': cart.offset().top + 10,
                    'left': cart.offset().left + 10,
                    'width': 75,
                    'height': 75
                }, 1000, 'easeInOutExpo');

        setTimeout(function () {
            cart.effect("shake", {
                times: 2
            }, 200);
        }, 1500);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function () {
            $(this).detach()
        });
    }
	
    jQuery.ajax({
        type: "POST",
        url: "" + UrlDomain + "/giohang/addcart",
        data: "{'ID':'" + id + "','quantity':'1'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
           
		   /*
		    var product = response.d;
            if (product != "") {
                alert(product);
            }
            else {
                GetCart();
                GetListCart();
                jQuery("#shopping-cart").removeClass("shopping-cart");
                jQuery("#shopping-cart").addClass("adtive-cart");
                setTimeout("jQuery('#shopping-cart').removeClass('adtive-cart'); jQuery('#shopping-cart').addClass('shopping-cart');", 4000);
            }
			*/
        },
        failure: function (msg) {
            alert(msg);
        }
    });
}
function get_short_cart(){
	$.post(UrlDomain + "/giohang/short_cart",{		
	},function(data){		 
		$('#cart > ul > myspan').html(data);		 
	});
}

jQuery(document).ready(function () {    
	get_total('1');	
	get_short_cart();
});

	function delete_item_cart(onid){									
		var href 	= $(onid).attr("myhref");
		var row_id 	= $(onid).parent().parent().attr('id');	
		$.ajax({
			type: "GET",
			url: href,
			success: function(response){
				
				if (response == "OK"){
					$('#'+row_id).css("background-color","#FF3700");
					$('#'+row_id).fadeOut(600, function(){
						$('#'+row_id).remove();
					});					
					get_total('1');
					//get_total('2');
					get_short_cart();					
					return false;										
				}else{
					alert('Error delete');
					return false;
				}
			}
		});
	}
$(document).ready(function (){
  $(".number").keypress(function (e){
     	if(e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
    	}
   });
});


$('#checkcreatepass').click(function () {			
	$('#contentcreatepass').toggle("slow");
});
$('#checkcreateadd').click(function () {			
	$('#contentcreateadd').toggle("slow");
});

function shop_search(tagstr){	
	if(tagstr == ''){
		alert("Hãy nhập chuỗi từ cần tìm kiếm");
		document.frmsearch.qsearch.focus();
		return false;
	}
} 
$(document).ready(function (){
	jQuery("#menu-icon").on("click", function(){
	  jQuery(".sf-menu-phone").slideToggle();
	  jQuery(this).toggleClass("active");
	 });
	
	  jQuery('.sf-menu-phone').find('li.parent').append('<i class="fa fa-angle-down"></i>');
	  jQuery('.sf-menu-phone li.parent i').on("click", function(){
	   if (jQuery(this).hasClass('fa-angle-up')) { jQuery(this).removeClass('fa-angle-up').parent('li.parent').find('> ul').slideToggle(); } 
		else {
		 jQuery(this).addClass('fa-angle-up').parent('li.parent').find('> ul').slideToggle();
		}
	  });
});
	
$(document).ready(function(){		
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
			$('.scrollToTop').css({bottom:"15px"});
		} else {
			$('.scrollToTop').css({bottom:"-100px"});
			$('.scrollToTop').fadeOut();
		}
	});	
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
	});	
	
	$('#sortsv').on('change', function() {
    	var url = $('#sortsv option:selected').attr('data-url');						
    	if(url) {
      		window.location = url;
    	}
    	return false;		
  	});
});

$(function () {
//for filter
			$("#gia > .checkbox").click(function () {
				var selected = new Array();
				$("#gia input[type=checkbox]:checked").each(function () {
					selected.push(this.value);
				});

				if (selected.length > 0) {
					//alert("Selected values: " + selected.join(","));
					$('#gia_id').val(selected.join(","));				
				}else{
					$('#gia_id').val('');
				}
				//alert($('#chatlieu_id').val());
			});
			
			$("#chatlieu > .checkbox").click(function () {
				var selected = new Array();
				$("#chatlieu input[type=checkbox]:checked").each(function () {
					selected.push(this.value);
				});

				if (selected.length > 0) {
					//alert("Selected values: " + selected.join(","));
					$('#chatlieu_id').val(selected.join(","));				
				}else{
					$('#chatlieu_id').val('');
				}
				//alert($('#chatlieu_id').val());
			});
			$("#bemat > .checkbox").click(function () {
				var selected = new Array();
				$("#bemat input[type=checkbox]:checked").each(function () {
					selected.push(this.value);
				});

				if (selected.length > 0) {
					//alert("Selected values: " + selected.join(","));
					$('#bemat_id').val(selected.join(","));				
				}else{
					$('#bemat_id').val('');
				}
				//alert($('#bemat_id').val());
			});
			
			$("#gia > .checkbox").change(function () {
					gia_id = $('#gia_id').val();
					chatlieu_id = $('#chatlieu_id').val();
					bemat_id = $('#bemat_id').val();
					
					var jqXHR=$.ajax({
						async: true,
						type: 'POST',						  
						url: UrlDomain + 'ajaction/count_fillter',						  
						data:{gia_id : gia_id,chatlieu_id : chatlieu_id,bemat_id : bemat_id},
						success: function(data) {             			
							//	
							//alert(data);
							if(data < 17){								
								document.getElementById('load_more').style.display = 'none';
								
							}else{
								document.getElementById('load_more').style.display = 'inline-block';
								page = 0;
							}

						},error: function (data){             			
							alert("Error !");
						}
					
					});
				
					var jqXHR=$.ajax({
						async: true,
						type: 'POST',						  
						url: UrlDomain + 'ajaction/load_fillter',						  
						data:{gia_id : gia_id,chatlieu_id : chatlieu_id,bemat_id : bemat_id},
						success: function(data) {             			
							$('#my_content').html(data);
							

						},error: function (data){             			
							alert("Error !");
						}
					
					});
			});
	
			$("#chatlieu > .checkbox").change(function () {
					gia_id = $('#gia_id').val();
					chatlieu_id = $('#chatlieu_id').val();
					bemat_id = $('#bemat_id').val();
					
					var jqXHR=$.ajax({
						async: true,
						type: 'POST',						  
						url: UrlDomain + 'ajaction/count_fillter',						  
						data:{gia_id : gia_id,chatlieu_id : chatlieu_id,bemat_id : bemat_id},
						success: function(data) {             			
							//						
							if(data < 17){								
								document.getElementById('load_more').style.display = 'none';
								
							}else{
								document.getElementById('load_more').style.display = 'inline-block';
								page = 0;
							}

						},error: function (data){             			
							alert("Error !");
						}
					
					});
				
					var jqXHR=$.ajax({
						async: true,
						type: 'POST',						  
						url: UrlDomain + 'ajaction/load_fillter',						  
						data:{gia_id : gia_id,chatlieu_id : chatlieu_id,bemat_id : bemat_id},
						success: function(data) {             			
							$('#my_content').html(data);
							

						},error: function (data){             			
							alert("Error !");
						}
					
					});
			});
	
			$("#bemat > .checkbox").change(function () {
					gia_id = $('#gia_id').val();
					chatlieu_id = $('#chatlieu_id').val();
					bemat_id = $('#bemat_id').val();
					
					var jqXHR=$.ajax({
						async: true,
						type: 'POST',						  
						url: UrlDomain + 'ajaction/count_fillter',						  
						data:{gia_id : gia_id,chatlieu_id : chatlieu_id,bemat_id : bemat_id},
						success: function(data) {             			
							//							
							if(data < 17){								
								document.getElementById('load_more').style.display = 'none';
								
							}else{
								document.getElementById('load_more').style.display = 'inline-block';
								page = 0;
							}

						},error: function (data){             			
							alert("Error !");
						}
					
					});
				
					var jqXHR=$.ajax({
						async: true,
						type: 'POST',						  
						url: UrlDomain + 'ajaction/load_fillter',						  
						data:{gia_id : gia_id,chatlieu_id : chatlieu_id,bemat_id : bemat_id},
						success: function(data) {             			
							$('#my_content').html(data);
							

						},error: function (data){             			
							alert("Error !");
						}
					
					});
			});
	//end filter
});


$(document).ready(function() {
	$('.fancybox').fancybox();
});