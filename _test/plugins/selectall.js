module( "plugins.selectall" );
test( 'selectall', function () {
    var editor = te.obj[0], db = editor.body;
    editor.setContent( '<p><em>xxxx</em></p>ssss' );
    editor.focus();
    editor.execCommand( 'selectAll' );
    editor.execCommand( "bold" );
    if(ua.browser.gecko)
        equal(editor.getContent(db),"<p><strong><em>xxxx</em></strong></p><p><strong>ssss</strong></p>","after calling selectall command");
    else
        equal(editor.getContent(db),"<p><em><strong>xxxx</strong></em></p><p><strong>ssss</strong></p>","after calling selectall command");
} );

test( 'a part of the content is selected', function () {
    var editor = te.obj[0], range = te.obj[1], db = editor.body;
    //var d = editor.document;
    editor.setContent( '<p><em>xxxx</em></p>ssss' );
    range.selectNode( db.lastChild.firstChild ).select();
    editor.execCommand( "bold" );
    equal( editor.getContent(db), "<p><em>xxxx</em></p><p><strong>ssss</strong></p>", "before calling selectAll command" );
    editor.execCommand( 'selectAll' );
    editor.execCommand( "bold" );
    if(ua.browser.gecko)
        equal( editor.getContent(db), "<p><strong><em>xxxx</em></strong></p><p><strong>ssss</strong></p>", "after calling selectAll command" );
    else
        equal( editor.getContent(db), "<p><em><strong>xxxx</strong></em></p><p><strong>ssss</strong></p>", "after calling selectAll command" );
} );

test( 'trace1743 :content is null', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><br></p>' );
    //TODO 现在必须先focus再selectall，trace1743
    editor.focus();
    editor.execCommand( 'selectAll' );
    equal( ua.getChildHTML( editor.body ), "<p><br></p>", "content is null" );
    //equal(UE.plugins['selectall'].notNeedUndo, 1, "notNeedUndo==1" );
    range.setStart( editor.body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( "bold" );
    ua.manualDeleteFillData( editor.body );
    equal( ua.getChildHTML( editor.body ), "<p><br></p>", "after calling command bold" );
} );

test( 'ctrl+a', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>全选的文本1</p><h1>全选的文本2</h1>' );
    range.selectNode( body.firstChild ).select();
    var p = body.firstChild;
    ua.keydown(editor.body,{'keyCode':65,'ctrlKey':true});
    setTimeout( function() {
        var range = editor.selection.getRange();
        if ( ua.browser.gecko )
            ua.checkResult( range, body, body, 0, 2, false, '查看全选后的range' );
        else
            ua.checkResult( range, body.firstChild.firstChild, body.lastChild.firstChild, 0, 6, false, '查看全选后的range' );
        start();
    }, 150 );
    stop();
} );