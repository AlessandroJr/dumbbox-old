var Inferno = {
    inicializiar: function() {
        var me = this;
        // if (localStorage.Token) {
        //     let primeiraVezOuF5 = true;
        //     let token = localStorage.Token;
        //     me.verificaValidToken(token, primeiraVezOuF5);
        // } else {
            debugger
            let primeiraVezOuF5 = false;
            let userDigitado = document.getElementById('userName').value;
            let passDigitado = document.getElementById('userPass').value;

            me.montarToken(userDigitado, passDigitado, function (token) {
                me.verificaValidToken(token, primeiraVezOuF5);
            });
        // }
    },

    Asc: function(String){
        return String.charCodeAt(0);
    },
    
    Chr: function(AsciiNum){
        return String.fromCharCode(AsciiNum)
    },

    montarToken: function (userName, userPass, cb) {
        var mensx="",
            l, i, j=0, ch,
            dados = userPass + '-/-/-' + userName;

        ch = "assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm--;//$#";
        for (i=0;i<dados.length; i++){
            j++;
            l=(this.Asc(dados.substr(i,1))+(this.Asc(ch.substr(j,1))));
            if (j==50){
                j=1;
            }
            if (l>255){
                l-=256;
            }
            mensx+=(this.Chr(l));
        }

        return cb(mensx);
    },

    desmontarToken: function (token, cb) {
        var mensx="",
            l, i, j=0, ch,
            dados,
            userName,
            userPass;

        ch = "assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm--;//$#";
        for (i=0; i<token.length;i++){
            j++;
            l=(this.Asc(token.substr(i,1))-(this.Asc(ch.substr(j,1))));
            if (j==50){
                j=1;
            }
            if (l<0){
                l+=256;
            }
            mensx+=(this.Chr(l));
        }

        dados = mensx.split('-/-/-');
        userName = dados[1];
        userPass = dados[0];
        
        return cb(userName, userPass);
    },

    verificaValidToken: function(token, primeiraVezOuF5, cb) {
        var me = this,
            encontradoUser,
            senhaCorreta,
            userDigitado,
            passDigitado,
            dados;

        me.desmontarToken(token, function (userName, userPass) {
            userDigitado = userName;
            passDigitado = userPass;

            me.util.getRequest('data/loginData', function (response) {
                dados = response.list;
    
                encontradoUser = dados.find(user => user.userName === userDigitado);
                senhaCorreta = dados.find(user => user.userPass === passDigitado)
                
    
                if (!senhaCorreta && !primeiraVezOuF5) {
                    return alert('\r\rERROOOOOOOU \n\n \r\r\r\r\rSenha incorreta!!');
                }
    debugger
                return;
            });
        });

    },

    util: {
        getRequest: function(nome, callback) {
            var req = new XMLHttpRequest();

            nome = nome + '.json';

            req.open("GET", nome, true);
            req.onreadystatechange = function ()
            {
                if(req.readyState === 4)
                {
                    //verifica se a requisição foi bem sucedida
                    if(req.status === 200 || req.status == 0)
                    {
                        callback(JSON.parse(req.responseText));
                    }
                }
            }
            req.send(null);
        }
    }
};

// Inferno.inicializiar();  