function Matrix(m) {
    if (typeof m == 'string') {
        var i, j;

        m = m.replace(/ /g, '');
        this.m = [];
        var mm = m.split(',');

        if (mm.length == 6) { // 3x2 -> 4x4
            this.n = 4;
            this.m[0] = [parseFloat(mm[0]), parseFloat(mm[1]), 0, 0];
            this.m[1] = [parseFloat(mm[2]), parseFloat(mm[3]), 0, 0];
            this.m[2] = [0,0,1,0];
            this.m[3] = [parseFloat(mm[4]), parseFloat(mm[5]), 0, 1];
        } else {
            this.n = Math.sqrt(mm.length);
            for (i = 0; i < this.n; i ++) {
                this.m[i] = [];
                for (j = 0; j < this.n; j ++) {
                    this.m[i][j] = parseFloat(mm[i * this.n + j]);
                }
            }
        }
    } else if (m instanceof Array) {
        if (m.length == 3 && m[0].length == 2) { // 3x2 -> 4x4
            this.n = 4;
            this.m[0] = m[0].concat([0,0]);
            this.m[1] = m[1].concat([0,0]);
            this.m[2] = [0,0,1,0];
            this.m[3] = m[3].concat([0,1]);
        } else {
            this.n = m.length;
            this.m = m; 
        }
    }
}

Matrix.prototype.multiply = function (m) {
    var result;
    var mat;
    if (m instanceof Matrix) {
        mat = [];
        for (var k = 0; k < this.n; k ++) {
            mat[k] = [];
            for (var i = 0; i < this.n; i ++) {
                mat[k][i] = 0;
                for (var j = 0; j < this.n; j ++) {
                    mat[k][i] += this.m[j][i] * m.m[k][j];
                }
            }
        }
        //$("#debug3").html(mat.toString());
        result = new Matrix(mat);
    } else if (m instanceof Array && m[0] instanceof Array) {
        mat = [];
        for (var k = 0; k < this.n; k ++) {
            mat[k] = [];
            for (var i = 0; i < this.n; i ++) {
                mat[k][i] = 0;
                for (var j = 0; j < this.n; j ++) {
                    mat[k][i] += this.m[j][i] * m[k][j];
                }
            }
        }
        result = new Matrix(mat);
    } else {
        var xyzt = m;
        result = [];
        for (var i = 0; i < this.n; i ++) {
            result[i] = 0;
            for (var j = 0; j < this.n; j ++) {
                result[i] += this.m[j][i] * xyzt[j];
            }
        }
    }
    return result;
}

Matrix.prototype.toString = function () {
    var i,j;
    var str = '';
    for (var i = 0; i < this.n; i ++) {
        for (var j = 0; j < this.n; j ++) {
            str += this.m[i][j];
            if (i != this.n - 1 || j != this.n - 1) {
                str += ',';
            }
        }
    }
    return str;
}

$(document).ready(function () {
    var planes = [
        [
            [
                ['blue', 'yellow', 'orange'], ['', 'yellow', 'orange'], ['green', 'yellow', 'orange'] 
            ],
            [
                ['blue', '', 'orange'], ['', '', 'orange'], ['green', '', 'orange'] 
            ],
            [
                ['blue', 'white', 'orange'], ['', 'white', 'orange'], ['green', 'white', 'orange'] 
            ] 
        ],
        [
            [
                ['blue', 'yellow', ''], ['', 'yellow', ''], ['green', 'yellow', ''] 
            ],
            [
                ['blue', '', ''], ['', '', ''], ['green', '', ''] 
            ],
            [
                ['blue', 'white', ''], ['', 'white', ''], ['green', 'white', ''] 
            ], 
        ],
        [
            [
                ['blue', 'yellow', 'red'], ['', 'yellow', 'red'], ['green', 'yellow', 'red']
            ],
            [
                ['blue', '', 'red'], ['', '', 'red'], ['green', '', 'red']
            ],
            [
                ['blue', 'white', 'red'], ['', 'white', 'red'], ['green', 'white', 'red']
            ] 
        ]
    ];
    var m;
    var x, y, z;
    var i,j;
    var eBlock, ePlane;
    var plane;
    var blocks = [];
    var timers = [];

    // Create the face element, which contains 9 blocks at the same side
    $("<div id='face'/>").appendTo("#cube");

    for (z = 0; z < 3; ++z) {
        blocks[z] = [];
        for (y = 0; y < 3; ++y) {
            blocks[z][y] = [];
            for (x = 0; x < 3; ++x) {
                blocks[z][y][x] = {};
                eBlock = $("<div class='block'/>");
                for (i = 0; i < 3; i++) {
                    plane = planes[z][y][x][i];

                    if (plane == '') {
                        continue;
                    }

                    ePlane = $("<div class='plane'/>");

                    eBlock.addClass(plane);
                    ePlane.addClass(plane);
                    switch (plane) {
                    case 'green':
                        m = 'matrix3d(0,0,-1,0,  0,1,0,0,  1,0,0,0,  50,0,0,1)';
                        break;
                    case 'blue':
                        m = 'matrix3d(0,0,1,0,  0,1,0,0,  -1,0,0,0,  -50,0,0,1)';
                        break;
                    case 'white':
                        m = 'matrix3d(1,0,0,0,  0,0,-1,0,  0,1,0,0,  0,50,0,1)';
                        break;
                    case 'yellow':
                        m = 'matrix3d(1,0,0,0,  0,0,1,0,  0,-1,0,0,  0,-50,0,1)';
                        break;
                    case 'red':
                        m = 'matrix3d(1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,50,1)';
                        break;
                    case 'orange':
                        m = 'matrix3d(1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,-50,1)';
                        break;
                    default:
                        break;
                    }

                    ePlane.css("-webkit-transform", m);
                    ePlane.appendTo(eBlock);
                }
                m = 'matrix3d(1,0,0,0,  0,1,0,0,  0,0,1,0,  ' + (x - 1) * 100 + ',' + (y - 1) * 100 + ',' + (z - 1) * 100 + ',1)';
                eBlock.css("-webkit-transform", m);
                eBlock.appendTo("#cube");
                blocks[z][y][x] = {elem: eBlock, elemPrev: null};
            }
        }
    }

   function rotateBlock(blocks, m, x, y, z) {
        var result;
        var x2,y2,z2,x3,y3,z3;
        var mStr;
        var matrix = '';

        result = m.multiply([x,y,z,1]);
        x2 = x + 1;
        y2 = y + 1;
        z2 = z + 1;
        x3 = result[0] + 1;
        y3 = result[1] + 1;
        z3 = result[2] + 1;
        if (!(x2 == x3 && y2 == y3 && z2 == z3)) {
            blocks[z3][y3][x3].elemPrev = blocks[z3][y3][x3].elem; // save the current one
            if (blocks[z2][y2][x2].elemPrev) {
                blocks[z3][y3][x3].elem = blocks[z2][y2][x2].elemPrev; // assign the new one
                blocks[z2][y2][x2].elemPrev = null;
            } else {
                blocks[z3][y3][x3].elem = blocks[z2][y2][x2].elem; // assign the new one
                blocks[z2][y2][x2].elem = null;
            }
        }

        mStr = $(blocks[z3][y3][x3].elem).css("-webkit-transform");
        if (mStr.search('matrix3d') != 0) { // is 3x2 matrix
            mStr = mStr.replace(/^matrix\((.*)\)$/, '$1');
            mStr = 'matrix3d(' + (new Matrix(mStr)).toString() + ')';
        }
        mStr  = mStr.replace(/(,[^,]+){4}$/, ',');
        mStr += (x3 - 1) * 100 + ',' + (y3 - 1) * 100 + ',' + (z3 - 1) * 100 + ',1)';
        mStr += ' ' + 'matrix3d(' + m.toString() + ')';
        $(blocks[z3][y3][x3].elem).appendTo($('#face'));
        return {elem: blocks[z3][y3][x3].elem, m: mStr};
    }

    function rotateFace(xyz, num, cw) {
        var x,y,z;
        var m;
        var faceBlocks = [];

        -- num;
        switch (xyz) {
        case 'x':
            m  = new Matrix([[1,0,0,0], [0,0,1,0], [0,-1,0,0], [0,0,0,1]]);
            break;
        case 'y':
            m = new Matrix([[0,0,1,0], [0,1,0,0], [-1,0,0,0], [0,0,0,1]]);
            break;
        case 'z':
            m = new Matrix([[0,1,0,0], [-1,0,0,0], [0,0,1,0], [0,0,0,1]]);
            break;
        }

        for (z = -1; z < 2; z ++) {
            if (xyz === 'z' && num != z) {
                continue;
            }
            for (y = -1; y < 2; y ++) {
                if (xyz === 'y' && num != y) {
                    continue;
                }
                if (xyz === 'x') {
                    x = num;
                    faceBlocks.push(rotateBlock(blocks, m, x, y, z));
                } else {
                    for (x = -1; x < 2; x ++) {
                        faceBlocks.push(rotateBlock(blocks, m, x, y, z));
                    }
                }
            }
        }
        $('#face').css('-webkit-transform', 'matrix3d(' + m.toString() + ')');
        setTimeout(function() {
            var block;
            while (block = faceBlocks.pop()) {
                $(block.elem).appendTo($('#cube'));
                $(block.elem).css("-webkit-transform", block.m);
            }
            $('#face').css('-webkit-transform', 'matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)');
        }, 1000);
    };

    function blockPos(blocks, blockElem) {
        var z,y,x;
        for (z = 0; z < 3; ++z) {
            for (y = 0; y < 3; ++y) {
                for (x = 0; x < 3; ++x) {
                    if (blocks[z][y][x].elem.attr('class') === blockElem.attr('class')) {
                        return {x:x, y:y, z:z};
                    }
                }
            }
        }
        return null;
    }
    
    var eCount = 0;
    var eClasses = [];
    var blockTrack = [];
    var planeMousedown = false;
    $(".plane").mousedown(function (ev) {
        ev.stopPropagation();

        eCount ++;
        $('#debug').html('[mousedown] eCount: ' + eCount);

        var plane = $(this).attr('class').replace(/^plane\s+/, '');
        var elem = $(this).parent();
        var pos = blockPos(blocks, elem);
        $('#debug2').html('[mousedown] pos: ' + pos.z + ',' + pos.y + ',' + pos.x);
        blockTrack.push({pos:pos, plane: plane});
        planeMousedown = true;
    }).mouseover(function (ev) {
        ev.stopPropagation();

        if (!planeMousedown) {
            return;
        }
        eCount ++;
        $('#debug').html('[mouseover] eCount: ' + eCount);
        if (eClasses.length == 4) eClasses.shift();
        eClasses.push($(this).attr('class'));
        $('#debug2').html('[mouseover] attr: ' + eClasses.join(','));

        var plane = $(this).attr('class').replace(/^plane\s+/, '');
        var elem = $(this).parent();
        var pos = blockPos(blocks, elem);
        blockTrack.push({pos: pos, plane: plane});
    }).mouseup(function (ev) {
        ev.stopPropagation();

        if (!planeMousedown) {
            return;
        }
        var debugTrack = [];
        $.each(blockTrack, function(i, b) {
            debugTrack.push('[' + b.plane + ' ' + b.pos.z + ',' + b.pos.y + ',' + b.pos.x + ']');
        });
        $('#debug3').html('[mouseup] block track: ' + debugTrack.join(', '));

        var plane = blockTrack[0].plane;
        var pos0 = blockTrack[0].pos;
        var pos1 = blockTrack[1].pos;
        if (plane === 'red') {
            if ((pos0.y == 0 && pos1.y == 0 && pos0.x < pos1.x) ||
                (pos0.y == 2 && pos1.y == 2 && pos0.x > pos1.x) ||
                (pos0.x == 0 && pos1.x == 0 && pos0.y > pos1.y) ||
                (pos0.x == 2 && pos1.x == 2 && pos0.y < pos1.y)    ) {
                rotateFace('z', pos0.z, 1);
            }
        }
        
        blockTrack = [];
        planeMousedown = false;
    });

    var mousedown = false;
    var x0, y0, x1, y1;
    var mX, mY, mXY;
    var start, end;
    var theta = 0, phi = 0;
    $("#stage").mousedown(function (ev) {
        $('#debug2').html('eCount: ' + eCount);
        eCount ++;

        mousedown = true;
        x0 = ev.pageX;
        y0 = ev.pageY;
    }).mousemove(function (ev) {
        if (!mousedown) {
            return;
        }
        
        x1 = ev.pageX;
        y1 = ev.pageY;
        theta += ((x1 - x0) / 400) * Math.PI;
        phi   += ((y0 - y1) / 400) * Math.PI;
        mX = new Matrix([[1,0,0,0], [0,Math.cos(phi),Math.sin(phi),0], [0,-Math.sin(phi),Math.cos(phi),0], [0, 0, 0, 1]]);
        mY = new Matrix([[Math.cos(theta),0,-Math.sin(theta), 0], [0,1,0,0,], [Math.sin(theta),0,Math.cos(theta),0], [0, 0, 0, 1]]);
        mXY = mX.multiply(mY);
        m = "matrix3d(" + mXY.toString() + ")";
        $("#cube").css("-webkit-transform", m);
        x0 = x1;
        y0 = y1;
    }).mouseup(function (ev) {
        mousedown = false;
        planeMousedown = false;
    });
});

function resetShape() {
    $("#cube").css("-webkit-transition", "-webkit-transform 2s, opacity 2s");
    $("#cube").css("-webkit-transform", 'matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)');
    //$("#cube").delay(2000).css("-webkit-transition", "");
    setTimeout(function() {$("#cube").css("-webkit-transition", "");}, 2000);
}
