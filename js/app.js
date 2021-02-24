var Inferno = {
    login: function() {
        var me = this;
        if (me.getTokenLocalStorage()) {
            let primeiraVezOuF5 = true;
            let token = me.getTokenLocalStorage();
            me.verificaValidToken(token, primeiraVezOuF5, function (success, msg) {
                if (success) {
                    me.inicializar();
                } else {
                    return msg;
                }
            });
        } else {
            let primeiraVezOuF5 = false;
            let userDigitado = document.getElementById('userName').value;
            let passDigitado = document.getElementById('userPass').value;

            me.montarToken(userDigitado, passDigitado, function (token) {
                me.verificaValidToken(token, primeiraVezOuF5, function (success, msg) {
                    if (success) {
                        me.inicializar();
                    } else {
                        return msg;
                    }
                });
            });
        }
    },

    Asc: function(String){
        return String.charCodeAt(0);
    },
    
    Chr: function(AsciiNum){
        return String.fromCharCode(AsciiNum);
    },

    genGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    montarToken: function (userName, userPass, cb) {
        var mensx="",
            l, i, j=0, ch,
            dados = this.genGuid() + '-/-/-' + userPass + '-/-/-' + this.genGuid() + '-/-/-' + userName + '-/-/-' + this.genGuid();

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

        this.setTokenLocalStorage(mensx);

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
        userName = dados[3];
        userPass = dados[1];
        
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
                
                if (!encontradoUser && primeiraVezOuF5) {
                    localStorage.clear();
                    return cb(false, alert('\r\rToken inválido! \n Faça login novamente.'));
                }

                if (!encontradoUser && !primeiraVezOuF5) {
                    localStorage.clear();
                    return cb(false, alert('\r\rUsuário não existe! \n Se você for novo por aqui, pode se cadastrar agora mesmo!'));
                }

                senhaCorreta = (encontradoUser.userPass === passDigitado) ? true : false;
                
                if (!senhaCorreta && !primeiraVezOuF5) {
                    return cb(false, alert('\r\rERROOOOOOOU! \n Usuário ou senha incorretos!'));
                }

                me.setUserConfig(encontradoUser);

                return cb(true);
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
    },

    setTokenLocalStorage: function (token){
        localStorage.DumbBoxToken = token;
    },

    getTokenLocalStorage: function (token){
        return localStorage.DumbBoxToken;
    },

    // Ao validar o DumbBoxToken, o usuário encontrado é setado para que seja possível acessálo sempre em Inferno.UserConfig
    UserConfig: {
        Id: null,
        Nome: null,
        Username: null,
        Email: null
    },
    setUserConfig: function (usuario) {
        this.UserConfig.Id = usuario.Id;
        this.UserConfig.Nome = usuario.userDisplayName;
        this.UserConfig.Username = usuario.userName;
        this.UserConfig.Email = usuario.email;
    },
    
    inicializar: function () {
        this.montaInfernoConfigs();
        this.carregarSite(function (success) {

        });
    },

    // configurações do sistema todo, depois colocar aqui permissões também
    montaInfernoConfigs: function () {

    },

    carregarSite: function (cb) {

        return cb();
    }
};