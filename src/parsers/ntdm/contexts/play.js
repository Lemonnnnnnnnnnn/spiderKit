import CryptoJS from 'crypto-js';
import { JSDOM } from "jsdom";

// 创建一个虚拟的 DOM 环境
const { window } = new JSDOM(`<!DOCTYPE html><p>Hello World</p>`);


// 模拟全局 window
global.window = window;
global.document = window.document;
global.navigator = window.navigator;

var _0xod4 = 'jsjiami.com.v6'
  , _0x175e = [_0xod4, 'JMOsw6omwoDCmw==', 'wp3DkSx5Eg==', 'HB7CscOJfS3DuUjDv2bDjsOmwr3Cm8KcwoI=', 'fR/Dqg==', 'ShRGTcKa', 'w5Y8VBs=', 'esKYKQ==', 'FgIdwrPDnMKOw7k=', 'HhXCmA==', 'woNrRsKSwpnDvcKfw4g=', 'ezBn', 'w43DkcK5w4MaJiE=', 'w44Ob8KjwrjCrMKtUA==', 'HwtswqI=', 'YsKnwrRawro=', 'Sm/CpQXCjz4RH8ORSXw=', 'IsO6w64=', 'T8OeAQ==', 'VcK4Hg==', 'csOmfBJ4', 'd8OAcA5L', 'Tn4RL2s=', 'w7goGizCmw==', 'w6XDlcOGwpoY', 'TsK7wpNPwrg=', 'w7J1CzLCnsO+HA==', 'w4XDkcK0w5YXPg==', 'S8KoCcKS', 'PcKWHcK/Eg==', 'Z2oMJ3rCiw==', 'YsKMG8KMwo0=', 'QsOecgRIwp4=', 'dFzDkUUxw48Qw7nCmX3CicODCMKnw74IOg==', 'acO2KU1B', 'wrAnw6DDrg==', 'w5MsScKwwoA=', 'wohZG8KhBg==', 'b8OieSpZ', 'w4ZmEsORw6I=', 'w7jDhxvCh8KY', 'w7wQa8KFwr0=', 'IMObw4E3wqU=', 'JsOjw5Erwrg=', 'w6MwcsKOwqU=', 'b8KIwqF0wrs=', 'XhXDvT52', 'wrDCmirChSE=', 'w5t1wpvDuwE=', 'XA7CtsKeEA==', 'wonCvVthw78=', 'U8KPP8KMwq4=', 'wp7DhCxjGTU=', 'woPDoBdiEQ==', 'HjzCrE/Dvg==', 'SsOQOWHCgg==', 'w6NdwoXCkMOx', 'w6shYWQ/', 'eE/Cgg==', 'XW/Csj7CmDoA', 'w680OynCgcK5BA8=', 'w4PDoMOTwrog', 'w5R7wqbCpMOPwrMxUcOiM8OuMVLCisKKFsOXAcOWY8O6w5hM', 'WwjDoht0', 'PzXCiHHDiA==', 'QMOFaMKcfQ==', 'bz9bVsK+', 'w7Npwp/DsB9ONw==', 'EcOPBQ3Cig==', 'woHDnzk=', 'DsKQLxtd', 'R8OCJmk=', 'wp55O8On', 'bkXCmhTCqg==', 'w7vDgx3Cg8KU', 'w6nDo8KdAn8=', 'O8KwP8KEDw==', 'wqzCtCHCtCg=', 'w5nDgmYhw5c=', 'wp0OZsK+w4A=', 'wrFxe8KFwp/DvcKew4EbN8K7BMORMx3DuxtOVELChsOEIQ==', 'BMKWRDc=', 'IS5dw6nDhQ==', 'w6geeG8t', 'SsK/wohywpc=', 'LBlnw7jDkA==', 'wodiLsOg', 'Ig5Ow7/Dlw==', 'TMOOewRZwoQ=', 'LjnClV7DvA==', 'woZsO8KcPQ==', 'eWvClMKeKQ==', 'wq1KWsKswr8=', 'w4p+AGFa', 'C8O7F8K2CQcKFxxgwo5sfh3DpAFV', 'w6XDqMKoCw==', 'w6Z8wqnCpMOe', 'w6x/CHRhXhV/w7I=', 'wrvClndGw5Y=', 'VsKcwo5RwoA=', 'ZcK2BMKmLQ==', 'BCcPwofDvQ==', 'eGEsF20=', 'eMOcUglq', 'w4U9XEAMw4/Dm3rCuzpxTg/DvyDDvMONH8OTwpTCtsKbw6k=', 'VwXDkTxG', 'CzHCrl3DkQ==', 'w7PDkVovw4o=', 'dsONYDdj', 'w79pwr3Duh4=', 'w55kwoLCpMOR', 'w6gbc8KGwpw=', 'bCnCtMKCCg==', 'Php5w64=', 'w7x8wpfDtiQ=', 'w4TDk2AB', 'w7lowoHDtgQ=', 'DB/CsnjDuQ==', 'woTDl8K3wp4S', 'wr0Ewq7Dq8Oh', 'GmHCpGxN', 'w5/Dm2XDpw==', 'w5bDpsOCwqoA', 'YMKowphwwqc=', 'ahFuVsK9', 'w57DtEsbw7k=', 'w6LDo8Kq', 'UsKzE8KO', 'w6xlBFl9', 'WMOgIXbCiw==', 'DBhjw5fDhQ==', 'w6pUwoHCnsOs', 'ZF7CtsKiHg==', 'wos4w7wCwr0c', 'JlXCjlpyw5pMw6s=', 'TcO1N8K4wqE=', 'SMOzTcKYRw==', 'w4HDosOzwrUc', 'wqxdwqE2wrY=', 'A8OPGQjChw==', 'wpkxasOxBQ==', 'wpIZSA==', 'VsOnEEvChg==', 'bMOSZy93', 'c8OwZsKnRQ==', 'SsK/wpBHwoQ=', 'ccOsHVFf', 'w6ZKYMO8w6rDr8OrCHxdwqtdwrDDksOMccKZwobDpQPDgsOrAMKXF8OMPcOySsKuL8KLwq8vwr/DkjbDqsOCbRrCkcOTTFfDlsKkw7PChCM1wqTDisKawpHDt8KCQRY3w6DDgMKVw6M=', 'w7hYwq3ClsOa', 'Fic5wqLDiw==', 'KcKqHCVV', 'wqvDucKSwrs/', 'YcOfQcKPSQ==', 'wpjClmNRw7U=', 'wpHClSnCizg=', 'w4PDh8Kw', 'JsOYGwnCpw==', 'w5vDksK8w6sl', 'U8ORCHt+Rw==', 'woVxO8OSJQ==', 'b37Chw/Clw==', 'w6ViBXZlQg==', 'UwPCucKQCgU=', 'UMOeZgs=', 'MTLCtW7Dq2o=', 'wqAQwr/DqcOi', 'DiLDtsOOZsKEbsOrGm03EcKEwr/CplQ=', 'dzPDnRhP', 'wplgT8KBwow=', 'XUzCg8KF', 'K8KTCcKrCQ==', 'w6ZKJMOw', 'LxTCmn/DsA==', 'wooObcKBw6g=', 'w5djwofDoTQ=', 'VMOHeAts', 'Kw96w7bDig==', 'wogpw6crwps=', 'PDzDn8OcWQ==', 'wrfCoWxfw4E=', 'wrrDv8KDwoI+', 'w7hnwrjCssOq', 'w4LDrMOwwpMp', 'S2vCvyjCjic=', 'w6DDoT7CtcKNwoo=', 'wp1Lw5zCpj4=', 'RsOEGcKVwps=', 'woxlwo0twoM=', 'MAZYw7TDmg==', 'w7ENEC7CgA==', 'wolVw4jCryEqVMOYdg==', 'wp45w6cCwqY=', 'w6UhVHs1', 'QBZFW8KH', 'Ozhvw7vDkQ==', 'E8O4DAXCnA==', 'AcOXR8OZ', 'w4NhwqbCk8O6', 'f8OyScKpRRJTBQd9w4t3PgzCtRMQwrjDrUZ9Z8Od', 'A8OHw7Inwoc=', 'wqlQE8KHDg==', 'wqYbZMOVMg==', 'w57DuVwAw60=', 'W8OyQMKtVAk=', 'w60PBwXCng==', 'w4h7w70gw55WbHfDuR0VQ8K+asOxwoJn', 'w5rDhMK2w5gX', 'N0HCklc=', 'w58TTsK4wrg=', 'w7dXNMOhw79pwqBMw70=', 'SsKQCcKf', 'KSXCumrDug==', 'woc1w7gUwrEEw7s=', 'wplowqIvwoFGMQ==', 'acO9DcK+', 'UMKBwpJNwp1ZfA==', 'wpV+NsKCLQ==', 'w5PDrMOrwo4iwrcU', 'XHjCoyPCkw==', 'w5kOUsKkwqXCqcKm', 'QMKRAcKDDMK+AA==', 'bMKoNcKgwrc=', 'w6k0HTPClw==', 'wpUYYcOcBA==', 'w6k6BjnCnMK9', 'w5HDnncPw60=', 'jEsjiamLiI.coRVzmBz.v6gWBKxrg=='];
(function(_0x2410c8, _0x4731c1, _0x21bfda) {
    var _0x12d6b4 = function(_0x56792e, _0x26ff38, _0x14a967, _0x1f013c, _0x21c988) {
        _0x26ff38 = _0x26ff38 >> 0x8,
        _0x21c988 = 'po';
        var _0x10be12 = 'shift'
          , _0x47704d = 'push';
        if (_0x26ff38 < _0x56792e) {
            while (--_0x56792e) {
                _0x1f013c = _0x2410c8[_0x10be12]();
                if (_0x26ff38 === _0x56792e) {
                    _0x26ff38 = _0x1f013c;
                    _0x14a967 = _0x2410c8[_0x21c988 + 'p']();
                } else if (_0x26ff38 && _0x14a967['replace'](/[ELIRVzBzgWBKxrg=]/g, '') === _0x26ff38) {
                    _0x2410c8[_0x47704d](_0x1f013c);
                }
            }
            _0x2410c8[_0x47704d](_0x2410c8[_0x10be12]());
        }
        return 0xa44cc;
    };
    return _0x12d6b4(++_0x4731c1, _0x21bfda) >> _0x4731c1 ^ _0x21bfda;
}(_0x175e, 0x15c, 0x15c00));
var _0x17f1 = function(_0x3abb24, _0x9f8a97) {
    _0x3abb24 = ~~'0x'['concat'](_0x3abb24);
    var _0x411694 = _0x175e[_0x3abb24];
    if (_0x17f1['nIHPps'] === undefined) {
        (function() {
            var _0x264909 = typeof window !== 'undefined' ? window : typeof process === 'object' && typeof require === 'function' && typeof global === 'object' ? global : this;
            var _0x52b78f = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            _0x264909['atob'] || (_0x264909['atob'] = function(_0x202c2d) {
                var _0x2e97e4 = String(_0x202c2d)['replace'](/=+$/, '');
                for (var _0x488147 = 0x0, _0x1702c1, _0x5d977a, _0x1a87f9 = 0x0, _0x2378be = ''; _0x5d977a = _0x2e97e4['charAt'](_0x1a87f9++); ~_0x5d977a && (_0x1702c1 = _0x488147 % 0x4 ? _0x1702c1 * 0x40 + _0x5d977a : _0x5d977a,
                _0x488147++ % 0x4) ? _0x2378be += String['fromCharCode'](0xff & _0x1702c1 >> (-0x2 * _0x488147 & 0x6)) : 0x0) {
                    _0x5d977a = _0x52b78f['indexOf'](_0x5d977a);
                }
                return _0x2378be;
            }
            );
        }());
        var _0x5cedb3 = function(_0x19b8a7, _0x9f8a97) {
            var _0x2b0e6a = [], _0x4f25fe = 0x0, _0x29acd8, _0x2643f2 = '', _0x58e8bd = '';
            _0x19b8a7 = atob(_0x19b8a7);
            for (var _0x1ac59f = 0x0, _0x3346bd = _0x19b8a7['length']; _0x1ac59f < _0x3346bd; _0x1ac59f++) {
                _0x58e8bd += '%' + ('00' + _0x19b8a7['charCodeAt'](_0x1ac59f)['toString'](0x10))['slice'](-0x2);
            }
            _0x19b8a7 = decodeURIComponent(_0x58e8bd);
            for (var _0xb0c930 = 0x0; _0xb0c930 < 0x100; _0xb0c930++) {
                _0x2b0e6a[_0xb0c930] = _0xb0c930;
            }
            for (_0xb0c930 = 0x0; _0xb0c930 < 0x100; _0xb0c930++) {
                _0x4f25fe = (_0x4f25fe + _0x2b0e6a[_0xb0c930] + _0x9f8a97['charCodeAt'](_0xb0c930 % _0x9f8a97['length'])) % 0x100;
                _0x29acd8 = _0x2b0e6a[_0xb0c930];
                _0x2b0e6a[_0xb0c930] = _0x2b0e6a[_0x4f25fe];
                _0x2b0e6a[_0x4f25fe] = _0x29acd8;
            }
            _0xb0c930 = 0x0;
            _0x4f25fe = 0x0;
            for (var _0x4f50dd = 0x0; _0x4f50dd < _0x19b8a7['length']; _0x4f50dd++) {
                _0xb0c930 = (_0xb0c930 + 0x1) % 0x100;
                _0x4f25fe = (_0x4f25fe + _0x2b0e6a[_0xb0c930]) % 0x100;
                _0x29acd8 = _0x2b0e6a[_0xb0c930];
                _0x2b0e6a[_0xb0c930] = _0x2b0e6a[_0x4f25fe];
                _0x2b0e6a[_0x4f25fe] = _0x29acd8;
                _0x2643f2 += String['fromCharCode'](_0x19b8a7['charCodeAt'](_0x4f50dd) ^ _0x2b0e6a[(_0x2b0e6a[_0xb0c930] + _0x2b0e6a[_0x4f25fe]) % 0x100]);
            }
            return _0x2643f2;
        };
        _0x17f1['RtnfNa'] = _0x5cedb3;
        _0x17f1['afYpDj'] = {};
        _0x17f1['nIHPps'] = !![];
    }
    var _0x5dc739 = _0x17f1['afYpDj'][_0x3abb24];
    if (_0x5dc739 === undefined) {
        if (_0x17f1['OqAPEJ'] === undefined) {
            _0x17f1['OqAPEJ'] = !![];
        }
        _0x411694 = _0x17f1['RtnfNa'](_0x411694, _0x9f8a97);
        _0x17f1['afYpDj'][_0x3abb24] = _0x411694;
    } else {
        _0x411694 = _0x5dc739;
    }
    return _0x411694;
};
function randomRange(_0x316169, _0x366b75) {
    var _0x12de10 = {
        'SiHhB': _0x17f1('0', '4ozi'),
        'wAvfY': function(_0x1e4b58, _0x2dbf7a) {
            return _0x1e4b58 === _0x2dbf7a;
        },
        'qtjRv': _0x17f1('1', 'E$Q('),
        'dswsX': 'sKOui',
        'TjLlt': function(_0x19a0e1, _0x1c6e1a) {
            return _0x19a0e1(_0x1c6e1a);
        },
        'VFeOY': function(_0x571973, _0x5e3aee) {
            return _0x571973 + _0x5e3aee;
        },
        'fDDLf': function(_0x1e4d24, _0x12b462) {
            return _0x1e4d24 == _0x12b462;
        },
        'LyrLZ': _0x17f1('2', 'krM4'),
        'JwAmt': function(_0x156f91, _0x282fc8) {
            return _0x156f91 != _0x282fc8;
        },
        'SCFeP': function(_0x2ccbaf, _0x172bcd) {
            return _0x2ccbaf > _0x172bcd;
        },
        'WSqOG': function(_0x3185c6) {
            return _0x3185c6();
        },
        'BHAQz': function(_0x3d48df, _0x46a177) {
            return _0x3d48df !== _0x46a177;
        },
        'jVeQa': _0x17f1('3', 'mXi8'),
        'eKGcn': 'input',
        'LknXM': _0x17f1('4', 'lVe]'),
        'yHPqc': 'tmQVZ',
        'XXfEx': function(_0x3bb43d, _0x32e22d, _0x3a6b22) {
            return _0x3bb43d(_0x32e22d, _0x3a6b22);
        },
        'TkGqK': function(_0x4ba25a) {
            return _0x4ba25a();
        },
        'lsqLE': 'TxqvY',
        'itwhb': _0x17f1('5', 'U^NI'),
        'avrKW': _0x17f1('6', 'qYmy'),
        'WwqrB': 'YfvFg',
        'vToXm': function(_0x33ee84) {
            return _0x33ee84();
        },
        'vbAqm': _0x17f1('7', 'Kgsv'),
        'zyRni': _0x17f1('8', 'tf!Z'),
        'jVxss': function(_0x437a5b, _0x33dc61) {
            return _0x437a5b !== _0x33dc61;
        },
        'zcqex': _0x17f1('9', '5GqJ'),
        'lwvrj': _0x17f1('a', '7Ce$'),
        'fifXM': function(_0x1fac9d, _0x5d1267) {
            return _0x1fac9d === _0x5d1267;
        },
        'qGeab': 'UGpVQ',
        'WuOZH': function(_0x2fc60c, _0x1f7b9f) {
            return _0x2fc60c - _0x1f7b9f;
        },
        'MimzG': function(_0x2f090c, _0x1ade2a) {
            return _0x2f090c < _0x1ade2a;
        },
        'ZonbX': function(_0x54e13c, _0x1cf4ad) {
            return _0x54e13c * _0x1cf4ad;
        },
        'ahdzP': function(_0x44d689, _0x375140) {
            return _0x44d689 - _0x375140;
        }
    };
    var _0x4a5bf6 = function() {
        var _0x24cf63 = {
            'qavHQ': function(_0x17a87c, _0x1d2bd5) {
                return _0x17a87c(_0x1d2bd5);
            },
            'VZmjX': function(_0x1d9404, _0x263408) {
                return _0x1d9404 !== _0x263408;
            },
            'gCMRS': _0x12de10[_0x17f1('b', 'KUD[')]
        };
        if (_0x12de10['wAvfY'](_0x12de10[_0x17f1('c', '!DVi')], _0x12de10['dswsX'])) {
            if (ret) {
                return debuggerProtection;
            } else {
                _0x24cf63[_0x17f1('d', 'wSC[')](debuggerProtection, 0x0);
            }
        } else {
            var _0x325156 = !![];
            return function(_0xd6e061, _0x1558c1) {
                var _0x1b2c35 = _0x325156 ? function() {
                    if (_0x1558c1) {
                        if (_0x24cf63[_0x17f1('e', '!ypU')]('PdZhB', _0x24cf63['gCMRS'])) {
                            return debuggerProtection;
                        } else {
                            var _0x221cee = _0x1558c1[_0x17f1('f', 'X^Wh')](_0xd6e061, arguments);
                            _0x1558c1 = null;
                            return _0x221cee;
                        }
                    }
                }
                : function() {}
                ;
                _0x325156 = ![];
                return _0x1b2c35;
            }
            ;
        }
    }();
    (function() {
        var _0xc6bd8d = {
            'rffZF': function(_0x1d631d, _0xd7285) {
                return _0x12de10[_0x17f1('10', '5UeQ')](_0x1d631d, _0xd7285);
            },
            'rHVGI': _0x17f1('11', 'bIU)'),
            'DgrmY': function(_0x4f43d0, _0x2c1658) {
                return _0x12de10[_0x17f1('12', 'U^NI')](_0x4f43d0, _0x2c1658);
            },
            'yCxFh': _0x12de10[_0x17f1('13', ')*!9')],
            'KDBgB': function(_0x4baed7, _0x54b4ef) {
                return _0x12de10[_0x17f1('14', '!DVi')](_0x4baed7, _0x54b4ef);
            },
            'VtVCv': 'i.com.v',
            'cRxJI': function(_0x4e129c, _0x5b8ebe) {
                return _0x12de10[_0x17f1('15', '4lrM')](_0x4e129c, _0x5b8ebe);
            },
            'ipxLm': function(_0x2015f3) {
                return _0x12de10[_0x17f1('16', '[siX')](_0x2015f3);
            },
            'GevbD': function(_0x3cbdc6, _0x5865f6) {
                return _0x12de10['BHAQz'](_0x3cbdc6, _0x5865f6);
            },
            'oBTsp': _0x17f1('17', 'GR1J'),
            'ndZgg': _0x12de10[_0x17f1('18', 'Kgsv')],
            'xqsYW': function(_0x29fad8, _0x57937c) {
                return _0x29fad8 + _0x57937c;
            },
            'rCAvo': function(_0x19383d, _0xc8485a) {
                return _0x19383d + _0xc8485a;
            },
            'qvHYf': _0x12de10[_0x17f1('19', 'd]zb')],
            'tlmhA': _0x12de10['LknXM'],
            'AyYSA': function(_0x763139) {
                return _0x763139();
            }
        };
        if (_0x12de10[_0x17f1('1a', 'O6Q^')](_0x12de10[_0x17f1('1b', 'PRWo')], 'tmQVZ')) {
            _0x12de10['TjLlt'](result, '0');
        } else {
            _0x12de10[_0x17f1('1c', '!DVi')](_0x4a5bf6, this, function() {
                if (_0xc6bd8d[_0x17f1('1d', '$seh')](_0x17f1('1e', 'ZC&)'), 'lgdEV')) {
                    var _0x201ca1 = _0xc6bd8d['rffZF'](_0x17f1('1f', '4jGV'), _0xc6bd8d['rHVGI']);
                    if (_0xc6bd8d[_0x17f1('20', 'X^Wh')](typeof _0xod4, _0xc6bd8d[_0x17f1('21', '4jGV')](_0x17f1('22', '[siX'), _0xc6bd8d['yCxFh'])) || _0xc6bd8d['KDBgB'](_0xod4, _0xc6bd8d[_0x17f1('23', 'PifN')](_0x201ca1, _0xc6bd8d[_0x17f1('24', 'VOiw')]) + _0x201ca1[_0x17f1('25', 'lVe]')])) {
                        var _0x4a02c1 = [];
                        while (_0xc6bd8d['cRxJI'](_0x4a02c1[_0x17f1('26', ')ecN')], -0x1)) {
                            _0x4a02c1[_0x17f1('27', ')*!9')](_0x4a02c1[_0x17f1('28', 'MCwr')] ^ 0x2);
                        }
                    }
                    _0xc6bd8d[_0x17f1('29', 'zICc')](_0x13edd3);
                } else {
                    var _0x3fd4e1 = new RegExp(_0x17f1('2a', 'ZQT%'));
                    var _0x491910 = new RegExp(_0xc6bd8d[_0x17f1('2b', 'wW&e')],'i');
                    var _0x3dc39b = _0x13edd3(_0xc6bd8d[_0x17f1('2c', 'twtP')]);
                    if (!_0x3fd4e1[_0x17f1('2d', 'tf!Z')](_0xc6bd8d[_0x17f1('2e', '*1MI')](_0x3dc39b, 'chain')) || !_0x491910[_0x17f1('2f', 'K&sG')](_0xc6bd8d[_0x17f1('30', 'MCwr')](_0x3dc39b, _0xc6bd8d[_0x17f1('31', 'bIU)')]))) {
                        if (_0xc6bd8d[_0x17f1('32', '1lDi')](_0xc6bd8d[_0x17f1('33', ')*!9')], 'IYyOQ')) {
                            _0x3dc39b('0');
                        } else {
                            if (fn) {
                                var _0x58ca08 = fn[_0x17f1('34', 'qYmy')](context, arguments);
                                fn = null;
                                return _0x58ca08;
                            }
                        }
                    } else {
                        _0xc6bd8d['AyYSA'](_0x13edd3);
                    }
                }
            })();
        }
    }());
    var _0x43af49 = function() {
        var _0xf4f7e6 = {
            'LTEIk': _0x12de10[_0x17f1('35', '5GqJ')],
            'WBXaB': _0x12de10['itwhb']
        };
        if (_0x12de10['avrKW'] === _0x12de10['WwqrB']) {
            _0x12de10[_0x17f1('36', 'ZQT%')](_0x13edd3);
        } else {
            var _0x140a43 = !![];
            return function(_0x5bf843, _0x1955c8) {
                var _0x3deb4d = {
                    'hRylp': function(_0x1d0a21, _0x146c70) {
                        return _0x1d0a21 * _0x146c70;
                    },
                    'fPiKe': function(_0x127ac1, _0x2a1762) {
                        return _0x127ac1 - _0x2a1762;
                    },
                    'hNAHb': _0xf4f7e6['LTEIk'],
                    'jipuQ': _0xf4f7e6['WBXaB']
                };
                var _0x3fcc5e = _0x140a43 ? function() {
                    var _0x3be756 = {
                        'AyPLL': function(_0xe10864, _0x42ab03) {
                            return _0x3deb4d[_0x17f1('37', '$seh')](_0xe10864, _0x42ab03);
                        },
                        'ELdtv': function(_0x4ddb31, _0x256fba) {
                            return _0x3deb4d['fPiKe'](_0x4ddb31, _0x256fba);
                        }
                    };
                    if (_0x1955c8) {
                        if (_0x3deb4d[_0x17f1('38', 'PRWo')] === _0x3deb4d[_0x17f1('39', 'Kgsv')]) {
                            var _0x33a1e0 = Math[_0x17f1('3a', 'wSC[')](_0x3be756['AyPLL'](Math[_0x17f1('3b', 'VOiw')](), _0x3be756['ELdtv'](_0xb8ee0d[_0x17f1('3c', 'PB2a')], 0x1)));
                            _0x2ea608 += _0xb8ee0d[_0x33a1e0];
                        } else {
                            var _0x3ecf73 = _0x1955c8[_0x17f1('3d', '3PvS')](_0x5bf843, arguments);
                            _0x1955c8 = null;
                            return _0x3ecf73;
                        }
                    }
                }
                : function() {}
                ;
                _0x140a43 = ![];
                return _0x3fcc5e;
            }
            ;
        }
    }();
    var _0x53609d = _0x12de10[_0x17f1('3e', 'KUD[')](_0x43af49, this, function() {
        if (_0x12de10[_0x17f1('3f', '!ypU')] === _0x12de10[_0x17f1('40', 'qYmy')]) {
            var _0x401a27 = fn['apply'](context, arguments);
            fn = null;
            return _0x401a27;
        } else {
            var _0xd19c09 = function() {};
            var _0x2a1fa2 = _0x12de10[_0x17f1('41', ']n3k')](typeof window, _0x17f1('42', '3PvS')) ? window : typeof process === _0x12de10[_0x17f1('43', '5GqJ')] && typeof require === _0x12de10['lwvrj'] && _0x12de10[_0x17f1('44', 'yMBM')](typeof global, _0x12de10[_0x17f1('45', '4ozi')]) ? global : this;
            if (!_0x2a1fa2['console']) {
                if (_0x12de10[_0x17f1('46', 'qYmy')] !== _0x12de10[_0x17f1('47', 'X^Wh')]) {
                    var _0x2140c8 = function() {
                        var _0x4365e9 = {
                            'QonTA': function(_0x47322f, _0x4f69ab) {
                                return _0x47322f + _0x4f69ab;
                            },
                            'KNvfs': _0x17f1('48', 'i&#4')
                        };
                        // (function(_0x2c8f23) {
                        //     var _0x2d74b7 = {
                        //         'XKGpD': function(_0x2df8e8, _0x1970ce) {
                        //             return _0x2df8e8(_0x1970ce);
                        //         },
                        //         'pxULo': function(_0x39c3ac, _0x453c4f) {
                        //             return _0x4365e9[_0x17f1('49', 'Kgsv')](_0x39c3ac, _0x453c4f);
                        //         },
                        //         'ilkkn': _0x17f1('4a', '!DVi'),
                        //         'nOOuP': _0x4365e9[_0x17f1('4b', 'Ivj@')]
                        //     };
                        //     return function(_0x2c8f23) {
                        //         return _0x2d74b7[_0x17f1('4c', ')Fuh')](Function, _0x2d74b7['pxULo'](_0x2d74b7[_0x17f1('4d', '5UeQ')], _0x2c8f23) + _0x2d74b7[_0x17f1('4e', 'E$Q(')]);
                        //     }(_0x2c8f23);
                        // }(_0x17f1('4f', '!DVi'))('de'));
                    };
                    return _0x12de10[_0x17f1('50', ']n3k')](_0x2140c8);
                } else {
                    _0x2a1fa2['console'] = function(_0xd19c09) {
                        var _0x5fdf1d = _0x17f1('51', '!ypU')[_0x17f1('52', '4jGV')]('|')
                          , _0xb7cef1 = 0x0;
                        while (!![]) {
                            switch (_0x5fdf1d[_0xb7cef1++]) {
                            case '0':
                                _0x546d91[_0x17f1('53', '7Ce$')] = _0xd19c09;
                                continue;
                            case '1':
                                _0x546d91['log'] = _0xd19c09;
                                continue;
                            case '2':
                                var _0x546d91 = {};
                                continue;
                            case '3':
                                _0x546d91[_0x17f1('54', 'GR1J')] = _0xd19c09;
                                continue;
                            case '4':
                                _0x546d91[_0x17f1('55', 'K&sG')] = _0xd19c09;
                                continue;
                            case '5':
                                _0x546d91[_0x17f1('56', 'i&#4')] = _0xd19c09;
                                continue;
                            case '6':
                                _0x546d91[_0x17f1('57', 'MCwr')] = _0xd19c09;
                                continue;
                            case '7':
                                return _0x546d91;
                            case '8':
                                _0x546d91['debug'] = _0xd19c09;
                                continue;
                            }
                            break;
                        }
                    }(_0xd19c09);
                }
            } else {
                _0x2a1fa2[_0x17f1('58', '5GqJ')]['log'] = _0xd19c09;
                _0x2a1fa2[_0x17f1('59', '!ypU')][_0x17f1('5a', 'KUD[')] = _0xd19c09;
                _0x2a1fa2[_0x17f1('5b', 'mwx8')][_0x17f1('5c', ')Fuh')] = _0xd19c09;
                _0x2a1fa2['console']['info'] = _0xd19c09;
                _0x2a1fa2[_0x17f1('5d', 'wSC[')][_0x17f1('5e', 'VOiw')] = _0xd19c09;
                _0x2a1fa2[_0x17f1('5f', 'GR1J')][_0x17f1('55', 'K&sG')] = _0xd19c09;
                _0x2a1fa2[_0x17f1('60', 'i&#4')]['trace'] = _0xd19c09;
            }
        }
    });
    _0x53609d();
    var _0x2ea608 = ''
      , _0x553b1e = _0x366b75 ? Math['round'](Math['random']() * _0x12de10[_0x17f1('61', 'mXi8')](_0x366b75, _0x316169)) + _0x316169 : _0x316169
      , _0xb8ee0d = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (var _0x5d0691 = 0x0; _0x12de10['MimzG'](_0x5d0691, _0x553b1e); _0x5d0691++) {
        var _0x66d39f = Math[_0x17f1('62', ']n3k')](_0x12de10[_0x17f1('63', '5UeQ')](Math[_0x17f1('64', ']n3k')](), _0x12de10[_0x17f1('65', 'E$Q(')](_0xb8ee0d[_0x17f1('66', 'Ivj@')], 0x1)));
        _0x2ea608 += _0xb8ee0d[_0x66d39f];
    }
    return _0x2ea608;
}

function v_decrypt(_0x2f61c9, _0x14dd13, _0x2bf4a2) {
    return CryptoJS[_0x17f1('70', '4ozi')][_0x17f1('71', '4jGV')](_0x2f61c9, _0x14dd13, {
        'iv': _0x2bf4a2
    })[_0x17f1('72', 'GR1J')](CryptoJS[_0x17f1('69', 'wW&e')][_0x17f1('73', 'qYmy')]);
}

function _0x13edd3(_0x2c6df8) {
    var _0x1f2171 = {
        'nPIhf': _0x17f1('84', 'mXi8'),
        'CykpK': _0x17f1('85', ')*!9'),
        'FqWRw': _0x17f1('86', '7Ce$'),
        'PKbpz': function(_0x15592e, _0x52043a) {
            return _0x15592e ^ _0x52043a;
        },
        'hREvQ': function(_0x195637, _0x26b6b9) {
            return _0x195637 === _0x26b6b9;
        },
        'njUjL': _0x17f1('87', '[siX'),
        'UkaJb': function(_0x20e53f, _0x2c24fc) {
            return _0x20e53f(_0x2c24fc);
        },
        'YQNYo': function(_0x4f1469, _0x40d749) {
            return _0x4f1469 + _0x40d749;
        },
        'vtwVo': function(_0x316eef, _0x5be54d) {
            return _0x316eef + _0x5be54d;
        },
        'xyGpR': _0x17f1('88', 'Kgsv'),
        'FdtUI': function(_0x128818, _0x597a42) {
            return _0x128818 !== _0x597a42;
        },
        'MhgKO': 'ituTj',
        'Ksjxq': 'function\x20*\x5c(\x20*\x5c)',
        'vEYQW': _0x17f1('17', 'GR1J'),
        'VNNRN': _0x17f1('89', 'GR1J'),
        'bbSxW': function(_0x124b41) {
            return _0x124b41();
        },
        'UEmjc': function(_0x3960a6, _0x420c5f) {
            return _0x3960a6 !== _0x420c5f;
        },
        'UJohA': _0x17f1('8a', ')Fuh'),
        'WOKXK': function(_0x4addd9, _0x2b979a) {
            return _0x4addd9 !== _0x2b979a;
        },
        'wGMQm': function(_0x3777bd, _0x42502e) {
            return _0x3777bd / _0x42502e;
        },
        'eeSfC': 'length',
        'QLZCz': _0x17f1('8b', ')*!9'),
        'hrwuQ': _0x17f1('8c', 'K&sG'),
        'feGWM': function(_0x5cf0df, _0x1483ab) {
            return _0x5cf0df !== _0x1483ab;
        },
        'SFdNU': _0x17f1('8d', 'PB2a')
    };
    function _0x5c2064(_0x69e6c5) {
        var _0x4e98aa = {
            'PZsCX': _0x1f2171[_0x17f1('8e', 'GR1J')],
            'kQWsv': function(_0x596205, _0x1af65a) {
                return _0x1f2171['PKbpz'](_0x596205, _0x1af65a);
            },
            'kVJLU': function(_0x346614, _0x879aa3) {
                return _0x1f2171[_0x17f1('8f', 'Ivj@')](_0x346614, _0x879aa3);
            },
            'ffmbc': _0x1f2171[_0x17f1('90', 'Ivj@')],
            'snNWc': function(_0x220af2, _0x4935f7) {
                return _0x1f2171['UkaJb'](_0x220af2, _0x4935f7);
            },
            'wwokw': function(_0x281866, _0x96e9ca) {
                return _0x1f2171[_0x17f1('91', 'GR1J')](_0x281866, _0x96e9ca);
            },
            'PBdom': function(_0x160974, _0x33f3ac) {
                return _0x1f2171[_0x17f1('92', '4lrM')](_0x160974, _0x33f3ac);
            },
            'ZNOJT': _0x1f2171['xyGpR'],
            'QFlzF': function(_0x42f423, _0x437f2f) {
                return _0x1f2171[_0x17f1('93', 'wW&e')](_0x42f423, _0x437f2f);
            },
            'xqcqA': _0x1f2171[_0x17f1('94', 'ZC&)')],
            'FHkVN': _0x1f2171[_0x17f1('95', '1lDi')],
            'wKqFX': _0x1f2171['vEYQW'],
            'XwGjG': _0x17f1('96', ')ecN'),
            'ywpcd': _0x1f2171[_0x17f1('97', '$seh')]
        };
        if (_0x1f2171[_0x17f1('98', 'mXi8')](typeof _0x69e6c5, _0x17f1('99', 'qETJ'))) {
            var _0x47a36c = function() {
                var _0x323199 = {
                    'zsmfb': function(_0x16460c, _0x2b4a48) {
                        return _0x16460c === _0x2b4a48;
                    },
                    'qSMWJ': _0x1f2171[_0x17f1('9a', 'qETJ')],
                    'hiSGG': _0x17f1('9b', 'MCwr')
                };
                // (function(_0x16b1e9) {
                //     var _0x498941 = {
                //         'scVGm': function(_0x49f472, _0x16845a) {
                //             return _0x49f472 + _0x16845a;
                //         }
                //     };
                //     if (_0x323199[_0x17f1('9c', 'U^NI')](_0x323199[_0x17f1('9d', 'Kgsv')], _0x323199[_0x17f1('9e', 'yMBM')])) {
                //         return CryptoJS[_0x17f1('9f', 'VOiw')][_0x17f1('a0', 'VOiw')](data, token_key, {
                //             'iv': token_iv
                //         })[_0x17f1('a1', ']n3k')](CryptoJS['enc']['Utf8']);
                //     } else {
                //         return function(_0x16b1e9) {
                //             return Function(_0x498941[_0x17f1('a2', 'wSC[')](_0x498941['scVGm'](_0x17f1('a3', 'Kgsv'), _0x16b1e9), '\x22)()'));
                //         }(_0x16b1e9);
                //     }
                // }(_0x1f2171[_0x17f1('a4', 'wW&e')])('de'));
            };
            return _0x1f2171[_0x17f1('a5', 'MCwr')](_0x47a36c);
        } else {
            if (_0x1f2171['UEmjc'](_0x17f1('a6', '!DVi'), _0x1f2171[_0x17f1('a7', '4ozi')])) {
                that[_0x17f1('a8', '1lDi')] = function(_0x3862a7) {
                    var CYZaSg = _0x4e98aa['PZsCX'][_0x17f1('a9', 'X^Wh')]('|')
                      , RcwSId = 0x0;
                    while (!![]) {
                        switch (CYZaSg[RcwSId++]) {
                        case '0':
                            _0x55cbae['trace'] = _0x3862a7;
                            continue;
                        case '1':
                            _0x55cbae[_0x17f1('aa', 'qETJ')] = _0x3862a7;
                            continue;
                        case '2':
                            _0x55cbae[_0x17f1('ab', 'O6Q^')] = _0x3862a7;
                            continue;
                        case '3':
                            _0x55cbae['debug'] = _0x3862a7;
                            continue;
                        case '4':
                            var _0x55cbae = {};
                            continue;
                        case '5':
                            _0x55cbae['exception'] = _0x3862a7;
                            continue;
                        case '6':
                            return _0x55cbae;
                        case '7':
                            _0x55cbae[_0x17f1('ac', 'U^NI')] = _0x3862a7;
                            continue;
                        case '8':
                            _0x55cbae[_0x17f1('ad', 'PifN')] = _0x3862a7;
                            continue;
                        }
                        break;
                    }
                }(_0x47a36c);
            } else {
                if (_0x1f2171[_0x17f1('ae', 'VOiw')](('' + _0x1f2171[_0x17f1('af', 'PB2a')](_0x69e6c5, _0x69e6c5))[_0x1f2171[_0x17f1('b0', 'krM4')]], 0x1) || _0x1f2171[_0x17f1('b1', '*1MI')](_0x69e6c5 % 0x14, 0x0)) {
                    if (_0x1f2171['QLZCz'] !== _0x1f2171['hrwuQ']) {
                        // (function(_0x836822) {
                        //     var _0x300ae8 = {
                        //         'EBUXx': function(_0x4ce19d, _0x26869e) {
                        //             return _0x4ce19d(_0x26869e);
                        //         },
                        //         'fvCfN': function(_0x1f00a4, _0x211d47) {
                        //             return _0x1f00a4 + _0x211d47;
                        //         }
                        //     };
                        //     if (_0x4e98aa[_0x17f1('b2', 'ZC&)')](_0x4e98aa['xqcqA'], _0x17f1('b3', 'E$Q('))) {
                        //         return _0x300ae8['EBUXx'](Function, _0x300ae8[_0x17f1('b4', 'bIU)')](_0x17f1('b5', 'twtP'), _0x836822) + _0x17f1('b6', '[siX'));
                        //     } else {
                        //         return function(_0x836822) {
                        //             var _0x1465dc = {
                        //                 'hqDed': function(_0x3d3aea, _0x3a2ed4) {
                        //                     return _0x4e98aa[_0x17f1('b7', 'qYmy')](_0x3d3aea, _0x3a2ed4);
                        //                 }
                        //             };
                        //             if (_0x4e98aa[_0x17f1('b8', 'yMBM')](_0x17f1('b9', 'mwx8'), _0x4e98aa[_0x17f1('ba', 'qYmy')])) {
                        //                 ar[_0x17f1('bb', 'PifN')](_0x1465dc[_0x17f1('bc', 'qYmy')](ar[_0x17f1('bd', ')*!9')], 0x2));
                        //             } else {
                        //                 return _0x4e98aa[_0x17f1('be', 'MCwr')](Function, _0x4e98aa[_0x17f1('bf', ')Fuh')](_0x4e98aa[_0x17f1('c0', 'tf!Z')]('Function(arguments[0]+\x22', _0x836822), _0x4e98aa[_0x17f1('c1', 'twtP')]));
                        //             }
                        //         }(_0x836822);
                        //     }
                        // }(_0x1f2171[_0x17f1('c2', 'lVe]')])('de'));
                        ;
                    } else {
                        var _0x29d29d = _0x17f1('c3', '!DVi')['split']('|')
                          , _0x38fda4 = 0x0;
                        while (!![]) {
                            switch (_0x29d29d[_0x38fda4++]) {
                            case '0':
                                _0xf07d28['log'] = _0x47a36c;
                                continue;
                            case '1':
                                return _0xf07d28;
                            case '2':
                                var _0xf07d28 = {};
                                continue;
                            case '3':
                                _0xf07d28[_0x17f1('c4', 'krM4')] = _0x47a36c;
                                continue;
                            case '4':
                                _0xf07d28[_0x17f1('c5', 'Kgsv')] = _0x47a36c;
                                continue;
                            case '5':
                                _0xf07d28[_0x17f1('c6', 'lVe]')] = _0x47a36c;
                                continue;
                            case '6':
                                _0xf07d28[_0x17f1('c7', '$seh')] = _0x47a36c;
                                continue;
                            case '7':
                                _0xf07d28[_0x17f1('c8', 'mwx8')] = _0x47a36c;
                                continue;
                            case '8':
                                _0xf07d28['warn'] = _0x47a36c;
                                continue;
                            }
                            break;
                        }
                    }
                } else {
                    // (function(_0x25522a) {
                    //     var _0xd142d7 = {
                    //         'RqKUt': _0x4e98aa[_0x17f1('c9', 'i&#4')],
                    //         'OtXWy': _0x4e98aa[_0x17f1('ca', 'd]zb')],
                    //         'VfuTN': function(_0x114c60, _0x24ecfd) {
                    //             return _0x4e98aa[_0x17f1('cb', 'frRw')](_0x114c60, _0x24ecfd);
                    //         },
                    //         'CgIZw': _0x4e98aa[_0x17f1('cc', ')*!9')],
                    //         'ooLyn': function(_0x2fa6aa, _0x30c8c0) {
                    //             return _0x2fa6aa === _0x30c8c0;
                    //         },
                    //         'LjJcj': _0x4e98aa['ywpcd'],
                    //         'tdiNn': function(_0x1a02f2, _0x2ffed7) {
                    //             return _0x1a02f2 + _0x2ffed7;
                    //         },
                    //         'ZADUK': _0x17f1('cd', 'yMBM')
                    //     };
                    //     return function(_0x25522a) {
                    //         var _0xbce937 = {
                    //             'RzOQV': _0xd142d7['RqKUt'],
                    //             'pGwYy': _0xd142d7[_0x17f1('ce', 'wW&e')],
                    //             'SOcut': function(_0x4b8810, _0xa0cd42) {
                    //                 return _0xd142d7[_0x17f1('cf', 'MCwr')](_0x4b8810, _0xa0cd42);
                    //             },
                    //             'lzfuT': _0xd142d7[_0x17f1('d0', 'E$Q(')],
                    //             'WuDoJ': function(_0x947f2f, _0x2e73cd) {
                    //                 return _0x947f2f + _0x2e73cd;
                    //             },
                    //             'QHiqf': function(_0x11818d, _0x7e89de) {
                    //                 return _0xd142d7[_0x17f1('d1', ')*!9')](_0x11818d, _0x7e89de);
                    //             }
                    //         };
                    //         if (_0xd142d7[_0x17f1('d2', '1lDi')](_0xd142d7[_0x17f1('d3', 'Kgsv')], 'woeog')) {
                    //             _0x19fb0d(this, function() {
                    //                 var _0xac3e82 = new RegExp(_0xbce937[_0x17f1('d4', 'GR1J')]);
                    //                 var _0x586c38 = new RegExp(_0xbce937['pGwYy'],'i');
                    //                 var _0x3daad1 = _0xbce937[_0x17f1('d5', ')ecN')](_0x13edd3, 'init');
                    //                 if (!_0xac3e82[_0x17f1('d6', 'qYmy')](_0x3daad1 + _0xbce937[_0x17f1('d7', '1lDi')]) || !_0x586c38[_0x17f1('d8', 'E$Q(')](_0xbce937['WuDoJ'](_0x3daad1, _0x17f1('d9', '1lDi')))) {
                    //                     _0xbce937[_0x17f1('da', 'MCwr')](_0x3daad1, '0');
                    //                 } else {
                    //                     _0x13edd3();
                    //                 }
                    //             })();
                    //         } else {
                    //             return _0xd142d7[_0x17f1('db', 'PRWo')](Function, _0xd142d7['tdiNn'](_0xd142d7[_0x17f1('dc', 'zICc')](_0xd142d7[_0x17f1('dd', '7Ce$')], _0x25522a), _0x17f1('de', 'ZC&)')));
                    //         }
                    //     }(_0x25522a);
                    // }('bugger')('de'));
                    ;
                }
            }
        }
        _0x5c2064(++_0x69e6c5);
    }
    try {
        if (_0x2c6df8) {
            if (_0x1f2171[_0x17f1('df', 'wSC[')](_0x1f2171[_0x17f1('e0', 'mwx8')], _0x1f2171['SFdNU'])) {
                var _0x28f2c9 = fn['apply'](context, arguments);
                fn = null;
                return _0x28f2c9;
            } else {
                return _0x5c2064;
            }
        } else {
            _0x1f2171['UkaJb'](_0x5c2064, 0x0);
        }
    } catch (_0x5a9f2f) {}
}
;_0xod4 = 'jsjiami.com.v6';

export function getTokens(bt_token){
    try { 
        var _token_key = CryptoJS['enc']['Utf8'][_0x17f1('67', 'qETJ')](_0x17f1('68', 'tf!Z'));
        var _token_iv = CryptoJS[_0x17f1('69', 'wW&e')]['Utf8'][_0x17f1('6a', '4ozi')](bt_token);
        var key_token = CryptoJS['enc'][_0x17f1('6b', 'yMBM')]['parse'](randomRange(0x10));

        return { 
            _token_key,
            _token_iv,
            key_token
        }
    }catch(e) { 
        console.error(e)
        return undefined
    }
}

export function getVideoInfo(_0x285840,bt_token) {
    const { _token_key, _token_iv, key_token } = getTokens(bt_token);

    var _0x588f2c = {
        'FXkAn': function(_0x2c724c, _0x31dd0e, _0x1319b1, _0x54639c) {
            return _0x2c724c(_0x31dd0e, _0x1319b1, _0x54639c);
        },
        'QIHdH': function(_0x6d6414, _0x56d335, _0x37bcd1, _0x10e641) {
            return _0x6d6414(_0x56d335, _0x37bcd1, _0x10e641);
        }
    };
    return _0x588f2c[_0x17f1('74', 'mwx8')](v_decrypt, _0x285840, _token_key, _token_iv)
}