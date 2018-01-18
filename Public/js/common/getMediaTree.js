$.fn.createcategory = function(node, boxid, ztreeObj, info) {
    switch (node.level) {
        case 1:
            var parent = node.getParentNode(), childs = parent.children, childs_sel_num = 0;
            plis = $("#" + boxid + " li[nid=" + parent.id + "]");
            if (plis.size() == 0) {
                var lis = $("#" + boxid + " li[nid=" + node.id + "]");
                if (lis.size() == 0) {
                    $.fn.appendcategoryHtml(node, boxid, ztreeObj, info);

                }
                $(childs).each(function(i, items) {
                    var remobj = $("#" + boxid + " li[nid=" + items.id + "]");
                    if (remobj.size() != 0) {
                        childs_sel_num++;
                    }
                });

                if (childs.length == childs_sel_num) {
                    $(childs).each(function(i, items) {
                        $("#" + boxid + " li[nid=" + items.id + "]").remove();
                    });
                    $.fn.appendcategoryHtml(parent, boxid, ztreeObj, info);

                }

            } else {
                plis.remove();
                $.fn.appendcategoryHtml(node, boxid, ztreeObj, info);

            }
            break;
        case 0:
            var childs = node.children;
            var lis = $("#" + boxid + " li[nid=" + node.id + "]");
            if (lis.size() == 0) {
                $(childs).each(function(i, items) {
                    $("#" + boxid + " li[nid=" + items.id + "]").remove();
                });
                $.fn.appendcategoryHtml(node, boxid, ztreeObj, info);
            }
    }
}
$.fn.appendcategoryHtml = function(node, boxid, ztreeObj, info) { //追趣
    if ($.trim($("#" + boxid).text()) == "如果不做设置，系统默认全选。") {
        $("#" + boxid).html("");
    }
    var li = document.createElement("li"),
            hdiv = $(li);
    hdiv.attr("id", node.id);
    hdiv.attr("nid", node.id);
    hdiv.attr("nname", node.name);
    hdiv.attr("flag", "category");
    hdiv.attr("class", "rs_box");

    hdiv.append('<input name="category[]" type="hidden" value="' + node.id + "-" + node.name + '"><span class="rs_close">' + node.name + '</span');

    $("#" + boxid).append(hdiv);
    var treeid = node.id;
    hdiv.bind("click", function() {
        $(this).remove();
    });
}
$.fn.checkallcategory = function(id, boxid, ztreeobj) {
    var znode = ztreeobj.getNodes();
    $("#" + id).bind("click", function() {
        $("#" + boxid).find("li[flag='category']").remove();
        $(znode).each(function(i, items) {
            $.fn.appendcategoryHtml(items, boxid, ztreeobj, "");
        });
    });
}
$.fn.uncheckall = function(id, boxid, ztreeobj, flag) {
    var znode = ztreeobj.getNodes();
    $("#" + id).unbind("click");
    $("#" + id).bind("click", function() {
        $("#" + boxid + "").empty();
    });
}
$.fn.checkallcategory = function(id, boxid, ztreeobj) {
    var znode = ztreeobj.getNodes();
    $("#" + id).bind("click", function() {
        $("#" + boxid).find("li[flag='category']").remove();
        $(znode).each(function(i, items) {
            $.fn.appendcategoryHtml(items, boxid, ztreeobj, "");
        });
    });
}
function searchTree(inputid, ztreeobj, treeid) {
    $("#" + inputid).click(function(e) {
        var val = $("#" + inputid).prev().find("input").val().toString().toLowerCase(),
                node = ztreeobj.getNodesByParamFuzzy("name", val, null);
        var val2 = $("#" + inputid).prev().find("input").val().toString().toUpperCase(),
                nodeup = ztreeobj.getNodesByParamFuzzy("name", val2, null);
        $.map(nodeup,
                function(n) {
                    node.push(n);
                });
        if (!val | node == "") {
            return
        }
        $("#" + treeid + " .curSelectedNode").each(function() {
            $(this).removeClass("curSelectedNode");
        });
        $(node).each(function(i, items) {
            var sp = $("#" + treeid + " li #" + items.tId + "_a");
            sp.addClass("curSelectedNode");
            switch (items.level) {
                case 0:
                    break;
                case 1:
                    var pr = items.getParentNode();
                    ztreeobj.expandNode(pr, true, false, true);
                    break;
                case 2:
                    var pr = items.getParentNode();
                    var pr2 = pr.getParentNode();
                    ztreeobj.expandNode(pr, true, false, true);
                    ztreeobj.expandNode(pr2, true, false, true);
                    break;
            }
        });

        return false;
    });
}
$.fn.getcategory = function() {
    var zTreeObjcategory;
    function addDiyDom(treeId, treeNode) {
        var spaceWidth = 5;
        var switchObj = $("#" + treeNode.tId + "_switch"),
                icoObj = $("#" + treeNode.tId + "_ico");
        switchObj.remove();
        icoObj.before(switchObj);
        if (treeNode.level > 1) {
            var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
            switchObj.before(spaceStr);
        }
        var addbt = $("#" + treeNode.tId + "_span");
        addbt.bind("click",
                function() {
                    $.fn.createcategory(treeNode, "categorytreebox", zTreeObjcategory, "");
                });

    }
    function beforeClick(treeId, treeNode) {

        //alert(treeNode.name);
        /*if (treeNode.level == 0 ) {
         var zTree = $.fn.zTree.getZTreeObj("categoryTree");
         zTree.expandNode(treeNode);
         return false;
         }*/
        return false;
    }
    var settingcategory = {
        check: {
            enable: false
        },
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: false,
            dblClickExpand: false,
            addDiyDom: addDiyDom
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClick
        }
    };
    
//    var myArray=[{"id":'51', "name":'121211','pId':'0'},{"id":'52', "name":'2322','pId':'0'}];  
    $.ajax({
        type: "POST",
        url: "/Common/ajaxGetCategoryTree",
        dataType: "json",
        success: function(msg) {
            var zTreeNodescategory = msg.data;
            var curMenu = null, zTree_Menu = null;
            var treeObj = $("#categoryTree");
            zTreeObjcategory = $.fn.zTree.init(treeObj, settingcategory, zTreeNodescategory);
            zTree_Menu = $.fn.zTree.getZTreeObj("categoryTree");
            //curMenu = zTree_Menu.getNodes()[0];
            //zTree_Menu.selectNode(curMenu);
            searchTree("searchcategory", zTreeObjcategory, "categoryTree");
            treeObj.hover(function() {
                if (!treeObj.hasClass("showIcon")) {
                    treeObj.addClass("showIcon");
                }
            }, function() {
                treeObj.removeClass("showIcon");
            });
            $.fn.checkallcategory("checkall_category", "categorytreebox", zTreeObjcategory, "category");
            $.fn.uncheckall("uncheckall_category", "categorytreebox", zTreeObjcategory, "category");
        }

    })


}