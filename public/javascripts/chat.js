 $(function () {
    var content = $('#content');
    var status = $('#status');
    var input = $('#input');
    var myName = false;
	
	org.owasp.esapi.ESAPI.initialize();

    //建立websocket连接
    socket = io.connect('http://localhost:3000');
    //收到server的连接确认
    socket.on('open',function(){
        status.text('Choose a name:');
    });

    //监听system事件，判断welcome或者disconnect，打印系统消息信息
    socket.on('system',function(json){
        var p = '';
        if (json.type === 'welcome'){
            if(myName==json.text) status.text(myName + ': ').css('color', json.color);
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Welcome ' + $ESAPI.encoder().encodeForHTML(json.text) +'</p>';
        }else if(json.type == 'disconnect'){
            p = '<p style="background:'+json.color+'">system  @ '+ json.time+ ' : Bye ' + $ESAPI.encoder().encodeForHTML(json.text) +'</p>';
        }
        content.prepend(p); 
    });

    //监听message事件，打印消息信息
    socket.on('message',function(json){
        var p = '<p><span style="color:'+json.color+';">' + $ESAPI.encoder().encodeForHTML(json.author)+'</span> @ '+ json.time+ ' : '+$ESAPI.encoder().encodeForHTML(json.text)+'</p>';
        content.prepend(p);
    });

    //通过“回车”提交聊天信息
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) return;
            socket.send(msg);
            $(this).val('');
            if (myName === false) {
                myName = msg;
            }
        }
    });
});