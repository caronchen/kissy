/**
 * @fileOverview common render for node
 * @author yiminghe@gmail.com
 */
KISSY.add("tree/node-render", function (S, Node, Component) {

    //<div class='ks-tree-node'>
    //<div class='ks-tree-node-row'>
    //<div class='ks-tree-expand-icon-t'></div>
    //<div class='ks-tree-node-checked0'></div>
    //<div class='ks-tree-file-icon'></div>
    //<span class='ks-tree-node-content'></span>
    //</div>
    //</div>

    var $ = Node.all,
        SELECTED_CLS = "ks-tree-node-selected",
        ROW_CLS = "ks-tree-node-row",
        COMMON_EXPAND_EL_CLS = "ks-tree-expand-icon-{t}",

    // refreshCss 实际使用顺序
    // expandIconEl
    // iconEl
    // contentEl
        EXPAND_ICON_EL_FILE_CLS = [
            COMMON_EXPAND_EL_CLS
        ].join(" "),
        EXPAND_ICON_EL_FOLDER_EXPAND_CLS = [
            COMMON_EXPAND_EL_CLS + "minus"
        ].join(" "),
        EXPAND_ICON_EL_FOLDER_COLLAPSE_CLS = [
            COMMON_EXPAND_EL_CLS + "plus"
        ].join(" "),
        ICON_EL_FILE_CLS = [
            "ks-tree-file-icon"
        ].join(" "),
        ICON_EL_FOLDER_EXPAND_CLS = [
            "ks-tree-expanded-folder-icon"
        ].join(" "),
        ICON_EL_FOLDER_COLLAPSE_CLS = [
            "ks-tree-collapsed-folder-icon"
        ].join(" "),
    // 实际使用，结束

        CONTENT_EL_CLS = "ks-tree-node-content",
        CHILDREN_CLS = "ks-tree-children",
        CHILDREN_CLS_L = "ks-tree-lchildren";

    return Component.Render.extend({

        refreshCss: function (isNodeSingleOrLast, isNodeLeaf) {
            var self = this,
                expanded = self.get("expanded"),
                iconEl = self.get("iconEl"),
                iconElCss,
                expandElCss,
                expandIconEl = self.get("expandIconEl"),
                childrenEl = self.get("childrenEl");

            if (isNodeLeaf) {
                iconElCss = ICON_EL_FILE_CLS;
                expandElCss = EXPAND_ICON_EL_FILE_CLS;
            } else {
                if (expanded) {
                    iconElCss = ICON_EL_FOLDER_EXPAND_CLS;
                    expandElCss = EXPAND_ICON_EL_FOLDER_EXPAND_CLS;
                } else {
                    iconElCss = ICON_EL_FOLDER_COLLAPSE_CLS;
                    expandElCss = EXPAND_ICON_EL_FOLDER_COLLAPSE_CLS;
                }
            }

            iconEl.attr("class", iconElCss);
            expandIconEl.attr("class", S.substitute(expandElCss, {
                "t": isNodeSingleOrLast ? "l" : "t"
            }));
            if (childrenEl) {
                childrenEl.attr("class", (isNodeSingleOrLast ? CHILDREN_CLS_L : CHILDREN_CLS));
            }
        },

        createDom: function () {
            var self = this,
                el = self.get("el"),
                id,
                rowEl,
                expandIconEl,
                iconEl,
                contentEl = self.get("contentEl");

            rowEl = $("<div class='" + ROW_CLS + "'/>");

            id = contentEl.attr("id");

            if (!id) {
                contentEl.attr("id", id = S.guid("ks-tree-node"));
            }

            expandIconEl = $("<div>").appendTo(rowEl);

            iconEl = $("<div>").appendTo(rowEl);

            contentEl.appendTo(rowEl);

            el.attr({
                "role": "tree-node",
                "aria-labelledby": id
            }).prepend(rowEl);

            self.__set("rowEl", rowEl);
            self.__set("expandIconEl", expandIconEl);
            self.__set("iconEl", iconEl);
        },

        _uiSetExpanded: function (v) {
            var self = this,
                childrenEl = self.get("childrenEl");
            if (childrenEl) {
                childrenEl[v ? "show" : "hide"]();
            }
            self.get("el").attr("aria-expanded", v);
        },

        _uiSetSelected: function (v) {
            var self = this,
                rowEl = self.get("rowEl");
            rowEl[v ? "addClass" : "removeClass"](SELECTED_CLS);
            self.get("el").attr("aria-selected", v);
        },

        _uiSetDepth: function (v) {
            this.get("el").attr("aria-level", v);
        },

        _uiSetTooltip: function (v) {
            this.get("el").attr("title", v);
        },

        /**
         * 内容容器节点，子树节点都插到这里
         * 默认调用 Component.Render.prototype.getContentElement 为当前节点的容器
         * 而对于子树节点，它有自己的子树节点容器（单独的div），而不是儿子都直接放在自己的容器里面
         * @protected
         * @return {NodeList}
         */
        getContentElement: function () {
            var self = this, c;
            if (c = self.get("childrenEl")) {
                return c;
            }
            c = $("<div " + (self.get("expanded") ? "" : "style='display:none'")
                + " role='group'><" + "/div>")
                .appendTo(self.get("el"));
            self.__set("childrenEl", c);
            return c;
        }
    }, {
        ATTRS: {
            childrenEl: {},
            expandIconEl: {},
            tooltip: {},
            iconEl: {},
            expanded: {
                value: false
            },
            rowEl: {},
            depth: {
                value: 0
            },
            contentEl: {
                valueFn: function () {
                    return $("<span id='" + S.guid("ks-tree-node") + "' class='" + CONTENT_EL_CLS + "'/>");
                }
            },
            isLeaf: {},
            selected: {}
        },

        HTML_PARSER: {
            childrenEl: function (el) {
                return el.children("." + CHILDREN_CLS);
            },
            contentEl: function (el) {
                return el.children("." + CONTENT_EL_CLS);
            },
            isLeaf: function (el) {
                var self = this;
                if (el.hasClass(self.getCssClassWithPrefix("tree-node-leaf"))) {
                    return true;
                }
                if (el.hasClass(self.getCssClassWithPrefix("tree-node-folder"))) {
                    return false;
                }
            },
            expanded: function (el) {
                var children = el.one(".ks-tree-children");
                if (!children) {
                    return false;
                }
                return children.css("display") != "none";
            }
        }

    });

}, {
    requires: ['node', 'component']
});