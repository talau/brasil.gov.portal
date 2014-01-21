var PBrasil = {
    init: function(){
        this.main();
        this.addClassHtml();
        this.onclickBuscar();
        this.bugfixBase();
        this.carregaDestaques();
        this.albuns.carrossel();
        this.albuns.fixAlbumHeight();
    },

    main: function() {

        // simulando click no botao do portlet header via mobile
        // author: deserto digital
        $('.portletNavigationTree .portletHeader').click(function () {
            $(this).toggleClass('ativo');
            $(this).next().slideToggle();
        });

        var menuTrigger = $(".menuTrigger");
        var navigationEl = $("#navigation");

        menuTrigger.click(function (e) {
            e.preventDefault();
            navigationEl.toggleClass("ativo");
        });

        var sectionTrigger = $(".mobile .portletNavigationTree dt a");
        sectionTrigger.append("<span></span>");


        sectionTrigger.click(function (e) {
            e.preventDefault();
            $(this).parent().parent().toggleClass("ativo");
        });
        $("ul li:last-child").addClass("last-item");

        var responsiveResize, root;

        root = typeof exports !== "undefined" && exports !== null ? exports : this;

        root.ResponsiveResize = function () {
            var _Singleton, _base;
            _Singleton = (function () {
                function _Singleton() {}

                _Singleton.prototype.perspectiva_anterior = '';
                _Singleton.prototype.scrollbar = false;

                _Singleton.prototype.resize = function () {
                    var perspectiva_atual;

                    if ($(window).width() <= 480) {
                        perspectiva_atual = 'mobile';
                    } else {
                        perspectiva_atual = 'desktop';
                    }

                    if (this.perspectiva_anterior !== perspectiva_atual) {
                        this.perspectiva_anterior = perspectiva_atual;

                        if (perspectiva_atual === 'mobile') {
                            $("body").addClass("mobile");
                        } else { // Desktop
                            $("body").removeClass("mobile");
                        }
                    }
                };

                return _Singleton;
            })();


            if ((_base = root.ResponsiveResize).instance == null) {
                _base.instance = new _Singleton();
            }
            return root.ResponsiveResize.instance;
        };

        var resize = function () {
            responsiveResize = new root.ResponsiveResize();
            responsiveResize.resize();
        }

        $(window).resize(function () {
            resize();
        });

        resize();

        $('.newsImageContainer .photo-icon').on('click', function(e) {
            e.preventDefault();
            $('#parent-fieldname-image').trigger('click');
        });

    },

    addClassHtml: function(){

        $("#portal-column-one div:first-child").addClass("first-item");

        /* Protection from the Content Manager */
        var firstNavigation = $("#portal-column-one .portletWrapper .portletNavigationTree")[0];
        if(firstNavigation){
            $(firstNavigation).addClass("first-item-nav");
        }

        if($('.link-externo').length > 0){
            $('.link-externo .collection-item:even').addClass ('even');
            $('.link-externo .collection-item:odd').addClass ('odd');
        }

    },

    onclickBuscar: function(){

        $('#link-buscar').click(function (e) {
            e.preventDefault();
            window.location.hash = '#portal-searchbox';
            $('.searchField').focus();
        });

    },

    /*
     * Bug fix para o bug de <base url=""> do Plone
     */
    bugfixBase: function(){

        if($("base").length > 0 && $(".userrole-anonymous").length > 0) {
            var aCurrentUrl = document.location.href.match(/(^[^#]*)/);

            $("base").attr("href", aCurrentUrl[1]);
        }
    },

    /*
     * Carrega capa /destaques no viewlet de destaques
     */
    carregaDestaques: function(){

        if ($('#featured-content').length > 0) {
            $('#featured-content').load(portal_url + '/destaques?ajax_load=1 #content > .row');
        }

    },

    albuns: {
        // View de álbum carrossel (carrossel de imagens do álbum)
        carrossel: function () {
            var obj = this,
            slideshows = $('.cycle-slideshow').on('cycle-next cycle-prev', function (e, opts) {
                slideshows.not(this).cycle('goto', opts.currSlide);
                obj.layoutAdjustment(opts.currSlide);
            });

            // Aplicando o mesmo controle de navegacao para os thumbs e galerias
            $('#cycle-2 .thumb-itens').click(function (e){
                e.preventDefault();
                var index = $('#cycle-2').data('cycle.API').getSlideIndex(this);
                slideshows.cycle('goto', index);
                obj.layoutAdjustment(index);
            });

            // Adicionando navegação por teclado
            $(document.documentElement).keyup(function (event) {
                if (event.keyCode == 37) {
                    $('#slideshow-2 .cycle-prev').trigger('click');
                } else if (event.keyCode == 39) {
                    $('#slideshow-2 .cycle-next').trigger('click');
                }
            });
        },

        layoutAdjustment: function(index){
            // Pula primeiro elemento
            index = index + 1;

            var aElem = $("#cycle-1 .cycle-slide");

            var elem = aElem[index];
            var novaaltura = $(elem).height();

            $(".cycle-sentinel").height(novaaltura);
        },

        fixAlbumHeight: function() {
            if ($('.template-galeria_de_albuns').length > 0) {
                var albumResponsiveResize, root;
                root = typeof exports !== "undefined" && exports !== null ? exports : this;
                root.AlbumResponsiveResize = function () {
                    var _Singleton, _base;
                    _Singleton = (function () {
                        function _Singleton() {}
                        _Singleton.prototype.qtd_coluna_anterior = '';
                        _Singleton.prototype.scrollbar = false;
                        _Singleton.prototype.resize = function () {
                            var qtd_coluna_atual;
                            qtd_coluna_atual = 1;
                            if ($(window).width() > 480) {
                                qtd_coluna_atual = 2;
                            }
                            // 3 columns, 460 + 30 padding
                            if ($(window).width() > 960) {
                                qtd_coluna_atual = 3;
                            }
                            if (this.qtd_coluna_anterior !== qtd_coluna_atual) {
                                this.qtd_coluna_anterior = qtd_coluna_atual;
                                var top = 0;
                                var height = 0;
                                var lilist = [];
                                var $item, $lilist;
                                $('#gallery_albums li').each(function(index, item) {
                                    $item = $(item);
                                    $item.height('auto');
                                });
                                $('#gallery_albums li').each(function(index, item) {
                                    $item = $(item);
                                    // if line change
                                    if ((top > 0) &&
                                        (top != $item.offset().top)) {
                                        $lilist = $(lilist);
                                        $lilist.height(height);
                                        top = 0;
                                        height = 0;
                                        lilist = [];
                                    }
                                    top = $item.offset().top;
                                    lilist.push(item);
                                    if ($item.height() > height) {
                                        height = $item.height();
                                    }
                                });
                                $lilist = $(lilist);
                                $lilist.height(height);
                            }
                        };
                        return _Singleton;
                    })();
                    if ((_base = root.AlbumResponsiveResize).instance == null) {
                        _base.instance = new _Singleton();
                    }
                    return root.AlbumResponsiveResize.instance;
                };
                var resize = function () {
                    albumResponsiveResize = new root.AlbumResponsiveResize();
                    albumResponsiveResize.resize();
                }
                $(window).resize(function () {
                    resize();
                });
                resize();
            }
        }
    }
}

jQuery(document).ready(function ($) {
    "use strict";
    PBrasil.init();
});
