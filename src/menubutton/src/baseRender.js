/**
 * @fileOverview render aria and drop arrow for menubutton
 * @author  yiminghe@gmail.com
 */
KISSY.add("menubutton/baseRender", function (S, Button) {

    var CAPTION_TMPL = '<div class="ks-menu-button-caption"><' + '/div>',

        DROP_TMPL =
            // 背景
            '<div class="ks-menu-button-dropdown">' +
                // 箭头
                '<div class=' +
                '"ks-menu-button-dropdown-inner">' +
                '<' + '/div>' +
                '<' + '/div>',
        COLLAPSE_CLS = "menu-button-open";

    return Button.Render.extend({

        createDom:function () {
            var self = this,
                el = self.get("el");
            el.append(DROP_TMPL)
                //带有 menu
                .attr("aria-haspopup", true);
        },

        _uiSetCollapsed:function (v) {
            var self = this,
                el = self.get("el"),
                cls = self.getCssClassWithPrefix(COLLAPSE_CLS);
            el[v ? 'removeClass' : 'addClass'](cls).attr("aria-expanded", !v);
        },

        _uiSetActiveItem:function (v) {
            this.get("el").attr("aria-activedescendant",
                (v && v.get("el").attr("id")) || "");
        }
    }, {
        ATTRS:{
            contentEl:{
                valueFn:function () {
                    return S.all(CAPTION_TMPL);
                }
            },
            activeItem:{
            },
            collapsed:{
                value:true
            }
        },
        HTML_PARSER:{
            contentEl:function(el){
                return el.children(".ks-menu-button-caption");
            }
        }
    });
}, {
    requires:['button']
});