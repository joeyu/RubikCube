var theta = 0, phi = 0;

function Matrix(m) {
    var i, j;
    this.m = [];
    if (typeof m == 'string') {

        m = m.replace(/ /g, '');
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
            this.m = m; // no copy 
        }
    } else if (m instanceof Matrix) {
        this.n = m.n;
        for (i = 0; i < this.n; i ++) {
            this.m[i] = [];
            for (j = 0; j < this.n; j ++) {
                this.m[i][j] = m.m[i][j];
            }
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
    } else if (m instanceof Array) {
        if (m[0] instanceof Array) { //2D
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
        } else { // 1D
            var xyzt = m;
            result = [];
            for (var i = 0; i < this.n; i ++) {
                result[i] = 0;
                for (var j = 0; j < this.n; j ++) {
                    result[i] += this.m[j][i] * xyzt[j];
                }
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
                        m = 'matrix3d(-1,0,0,0,  0,1,0,0,  0,0,-1,0,  0,0,-50,1)';
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
                blocks[z][y][x] = {elem: eBlock, elemSaved: null};
            }
        }
    }

    function rotateBlock(blocks, m, x, y, z) {
        var result;
        var x2,y2,z2,x3,y3,z3;
        var m2;
        var matrix = '';

        result = m.multiply([x - 1, y - 1, z - 1, 1]);
        x2 = result[0] + 1;
        y2 = result[1] + 1;
        z2 = result[2] + 1;
        if (!(x == x2 && y == y2 && z == z2)) {
            blocks[z2][y2][x2].elemSaved = blocks[z2][y2][x2].elem; // save the current one
            if (blocks[z][y][x].elemSaved) {
                blocks[z2][y2][x2].elem = blocks[z][y][x].elemSaved; // assign the new one
                blocks[z][y][x].elemSaved = null;
            } else {
                blocks[z2][y2][x2].elem = blocks[z][y][x].elem; // assign the new one
                blocks[z][y][x].elem = null;
            }
        }

        $(blocks[z2][y2][x2].elem).appendTo($('#face'));
        m2 = getTransformMatrix(blocks[z2][y2][x2].elem);
        if (z2 == 2 && y2 == 0 && x2 == 0)
            console.log("[rotateBlock] m2: " + m2);
        m2.m[3][0] = 0;
        m2.m[3][1] = 0;
        m2.m[3][2] = 0;
        m2 = m.multiply(m2);
        m2.m[3][0] = (x2 - 1) * 100;
        m2.m[3][1] = (y2 - 1) * 100;
        m2.m[3][2] = (z2 - 1) * 100;
        if (z2 == 2 && y2 == 0 && x2 == 0)
            console.log("[rotateBlock] m2: " + m2);

        return {elem: blocks[z2][y2][x2].elem, m: m2};
    }

    function rotateFace(xyz, num, cw) { // cw == 1 -- clockwise; cw == -1 -- counter-clockwise
        var x,y,z;
        var m;
        var faceBlocks = [];

        switch (xyz) {
        case 'x':
            m  = new Matrix([[1,0,0,0], [0,0,cw,0], [0,-cw,0,0], [0,0,0,1]]);
            break;
        case 'y':
            m = new Matrix([[0,0,-cw,0], [0,1,0,0], [cw,0,0,0], [0,0,0,1]]);
            break;
        case 'z':
            m = new Matrix([[0,cw,0,0], [-cw,0,0,0], [0,0,1,0], [0,0,0,1]]);
            break;
        }

        for (z = 0; z < 3; z ++) {
            if (xyz === 'z' && num != z) {
                continue;
            }
            for (y = 0; y < 3; y ++) {
                if (xyz === 'y' && num != y) {
                    continue;
                }
                if (xyz === 'x') {
                    x = num;
                    faceBlocks.push(rotateBlock(blocks, m, x, y, z));
                } else {
                    for (x = 0; x < 3; x ++) {
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
                $(block.elem).css("-webkit-transform", "matrix3d(" + block.m + ")");
            }
            $('#face').css('-webkit-transform', 'matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)');
        }, 500);
    }

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
    
    function getTransformMatrix(elem) {
        var m;

        if (typeof elem == 'string') {
            m = elem;
        } else {
            m = elem.css("-webkit-transform");
        }
        if (m.search('matrix3d') != 0) { // is 3x2 matrix
            m = m.replace(/^matrix\((.*)\)$/, '$1');
            m = new Matrix(m);
        } else {
            m = m.replace(/^matrix3d\((.*)\)$/, '$1');
            m = new Matrix(m);
        }

        return m;
    }

    
    var eCount = 0;
    var eClasses = [];
    var blockTrack = [];
    var planeMousedown = false;
    $(".plane").mousedown(function (ev) {
        ev.stopPropagation();

        var plane = $(this).attr('class').replace(/^plane\s+/, '');
        var elem = $(this).parent();
        var pos = blockPos(blocks, elem);
        //$('#debug2').html('[mousedown] pos: ' + pos.z + ',' + pos.y + ',' + pos.x);
        blockTrack.push({pos:pos, plane: $(this)});
        planeMousedown = true;
    }).mouseover(function (ev) {
        eCount ++;
        //console.log("plane eCount: " + eCount);
        if (!planeMousedown) {
            return;
        }

        if (eClasses.length == 4) eClasses.shift();
        eClasses.push($(this).attr('class'));
        //$('#debug2').html('[mouseover] attr: ' + eClasses.join(','));

        var elem = $(this).parent();
        var pos = blockPos(blocks, elem);
        blockTrack.push({pos: pos, plane: $(this)});
    }).mouseup(function (ev) {
        if (!planeMousedown) {
            return;
        }

        if (blockTrack.length < 2) {
            blockTrack = [];
            planeMousedown = false;
            return;
        }
        //var debugTrack = [];
        //$.each(blockTrack, function(i, b) {
        //    var plane = b.plane.attr('class').replace(/plane\s+/, '');
        //    debugTrack.push('[' + plane + ' ' + b.pos.z + ',' + b.pos.y + ',' + b.pos.x + ']');
        //});
        //$('#debug3').html('[mouseup] block track: ' + debugTrack.join(', '));

        var pos0 = blockTrack[0].pos;
        var pos1 = blockTrack[1].pos;
        var mBlock0 = getTransformMatrix(blocks[pos0.z][pos0.y][pos0.x].elem);
        //console.log('[mouseup] mBlock0: ' + mBlock0.m);
        var mPlane0 = getTransformMatrix(blockTrack[0].plane);
        //console.log('[mouseup] mPlane0: ' + mPlane0.m);
        var m = mBlock0.multiply(mPlane0);
        var t, sign;
        for (t = 0; t < 3; ++ t) {
            if (m.m[3][t] == 150) {
                sign = 1;
                break;
            } else if (m.m[3][t] == -150) {
                sign = -1;
                break;
            }
        } 
        //console.log("[mouseup] t=" + t + ", sign=" + sign + ", m.m=" + m.m);
        var cw1, cw2;
        if ( t == 0) { // x plane
            cw1 = (pos1.y - pos0.y) * m.m[3][t];
            cw2 = (pos0.z - pos1.z) * m.m[3][t];
            cw1 = cw1 == 0 ? 0 : cw1 > 1 ? 1 : -1;
            cw2 = cw2 == 0 ? 0 : cw2 > 1 ? 1 : -1;
            if (cw1) {
                rotateFace('z', pos0.z, cw1);
            } else if (cw2) {
                rotateFace('y', pos0.y, cw2);
            }
        } else if (t == 1) { // y plane
            cw1 = (pos0.x - pos1.x) * m.m[3][t];
            cw2 = (pos1.z - pos0.z) * m.m[3][t];
            cw1 = cw1 == 0 ? 0 : cw1 > 1 ? 1 : -1;
            cw2 = cw2 == 0 ? 0 : cw2 > 1 ? 1 : -1;
            if (cw1) {
                rotateFace('z', pos0.z, cw1);
            } else if (cw2) {
                rotateFace('x', pos0.x, cw2);
            }
        } else if (t == 2) { // z plane
            cw1 = (pos1.x - pos0.x) * m.m[3][t];
            cw2 = (pos0.y - pos1.y) * m.m[3][t];
            cw1 = cw1 == 0 ? 0 : cw1 > 1 ? 1 : -1;
            cw2 = cw2 == 0 ? 0 : cw2 > 1 ? 1 : -1;
            //console.log("cw1,cw2: " + cw1 + ',' + cw2);
            if (cw1) {
                rotateFace('y', pos0.y, cw1);
            } else if (cw2) {
                rotateFace('x', pos0.x, cw2);
            }
        } 
        
        blockTrack = [];
        planeMousedown = false;
    });

    var mousedown = false;
    var x0, y0, x1, y1;
    var mX, mY, mXY;
    var start, end;
    $("#stage").mousedown(function (ev) {
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

function resetCube() {
    theta = 0;
    phi = 0;
    $("#cube").css("-webkit-transition", "-webkit-transform 1s, opacity 2s");
    $("#cube").css("-webkit-transform", 'matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)');
    //$("#cube").delay(2000).css("-webkit-transition", "");
    setTimeout(function() {$("#cube").css("-webkit-transition", "");}, 1000);
}
