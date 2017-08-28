/**
 * Cesium - https://github.com/AnalyticalGraphicsInc/cesium
 *
 * Copyright 2011-2017 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/AnalyticalGraphicsInc/cesium/blob/master/LICENSE.md for full licensing details.
 */
(function () {
define('Core/defined',[],function() {
    'use strict';

    /**
     * @exports defined
     *
     * @param {Object} value The object.
     * @returns {Boolean} Returns true if the object is defined, returns false otherwise.
     *
     * @example
     * if (Cesium.defined(positions)) {
     *      doSomething();
     * } else {
     *      doSomethingElse();
     * }
     */
    function defined(value) {
        return value !== undefined && value !== null;
    }

    return defined;
});

define('Core/defineProperties',[
        './defined'
    ], function(
        defined) {
    'use strict';

    var definePropertyWorks = (function() {
        try {
            return 'x' in Object.defineProperty({}, 'x', {});
        } catch (e) {
            return false;
        }
    })();

    /**
     * Defines properties on an object, using Object.defineProperties if available,
     * otherwise returns the object unchanged.  This function should be used in
     * setup code to prevent errors from completely halting JavaScript execution
     * in legacy browsers.
     *
     * @private
     *
     * @exports defineProperties
     */
    var defineProperties = Object.defineProperties;
    if (!definePropertyWorks || !defined(defineProperties)) {
        defineProperties = function(o) {
            return o;
        };
    }

    return defineProperties;
});

define('Core/CompressedTextureBuffer',[
        './defined',
        './defineProperties'
    ], function(
        defined,
        defineProperties) {
    'use strict';

    /**
     * Describes a compressed texture and contains a compressed texture buffer.
     *
     * @param {PixelFormat} internalFormat The pixel format of the compressed texture.
     * @param {Number} width The width of the texture.
     * @param {Number} height The height of the texture.
     * @param {Uint8Array} buffer The compressed texture buffer.
     */
    function CompressedTextureBuffer(internalFormat, width, height, buffer) {
        this._format = internalFormat;
        this._width = width;
        this._height = height;
        this._buffer =  buffer;
    }

    defineProperties(CompressedTextureBuffer.prototype, {
        /**
         * The format of the compressed texture.
         * @type PixelFormat
         * @readonly
         */
        internalFormat : {
            get : function() {
                return this._format;
            }
        },
        /**
         * The width of the texture.
         * @type Number
         * @readonly
         */
        width : {
            get : function() {
                return this._width;
            }
        },
        /**
         * The height of the texture.
         * @type Number
         * @readonly
         */
        height : {
            get : function() {
                return this._height;
            }
        },
        /**
         * The compressed texture buffer.
         * @type Uint8Array
         * @readonly
         */
        bufferView : {
            get : function() {
                return this._buffer;
            }
        }
    });

    /**
     * Creates a shallow clone of a compressed texture buffer.
     *
     * @param {CompressedTextureBuffer} object The compressed texture buffer to be cloned.
     * @return {CompressedTextureBuffer} A shallow clone of the compressed texture buffer.
     */
    CompressedTextureBuffer.clone = function(object) {
        if (!defined(object)) {
            return undefined;
        }

        return new CompressedTextureBuffer(object._format, object._width, object._height, object._buffer);
    };

    /**
     * Creates a shallow clone of this compressed texture buffer.
     *
     * @return {CompressedTextureBuffer} A shallow clone of the compressed texture buffer.
     */
    CompressedTextureBuffer.prototype.clone = function() {
        return CompressedTextureBuffer.clone(this);
    };

    return CompressedTextureBuffer;
});

define('Core/freezeObject',[
        './defined'
    ], function(
        defined) {
    'use strict';

    /**
     * Freezes an object, using Object.freeze if available, otherwise returns
     * the object unchanged.  This function should be used in setup code to prevent
     * errors from completely halting JavaScript execution in legacy browsers.
     *
     * @private
     *
     * @exports freezeObject
     */
    var freezeObject = Object.freeze;
    if (!defined(freezeObject)) {
        freezeObject = function(o) {
            return o;
        };
    }

    return freezeObject;
});

define('Core/WebGLConstants',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * Enum containing WebGL Constant values by name.
     * for use without an active WebGL context, or in cases where certain constants are unavailable using the WebGL context
     * (For example, in [Safari 9]{@link https://github.com/AnalyticalGraphicsInc/cesium/issues/2989}).
     *
     * These match the constants from the [WebGL 1.0]{@link https://www.khronos.org/registry/webgl/specs/latest/1.0/}
     * and [WebGL 2.0]{@link https://www.khronos.org/registry/webgl/specs/latest/2.0/}
     * specifications.
     *
     * @exports WebGLConstants
     */
    var WebGLConstants = {
        DEPTH_BUFFER_BIT : 0x00000100,
        STENCIL_BUFFER_BIT : 0x00000400,
        COLOR_BUFFER_BIT : 0x00004000,
        POINTS : 0x0000,
        LINES : 0x0001,
        LINE_LOOP : 0x0002,
        LINE_STRIP : 0x0003,
        TRIANGLES : 0x0004,
        TRIANGLE_STRIP : 0x0005,
        TRIANGLE_FAN : 0x0006,
        ZERO : 0,
        ONE : 1,
        SRC_COLOR : 0x0300,
        ONE_MINUS_SRC_COLOR : 0x0301,
        SRC_ALPHA : 0x0302,
        ONE_MINUS_SRC_ALPHA : 0x0303,
        DST_ALPHA : 0x0304,
        ONE_MINUS_DST_ALPHA : 0x0305,
        DST_COLOR : 0x0306,
        ONE_MINUS_DST_COLOR : 0x0307,
        SRC_ALPHA_SATURATE : 0x0308,
        FUNC_ADD : 0x8006,
        BLEND_EQUATION : 0x8009,
        BLEND_EQUATION_RGB : 0x8009, // same as BLEND_EQUATION
        BLEND_EQUATION_ALPHA : 0x883D,
        FUNC_SUBTRACT : 0x800A,
        FUNC_REVERSE_SUBTRACT : 0x800B,
        BLEND_DST_RGB : 0x80C8,
        BLEND_SRC_RGB : 0x80C9,
        BLEND_DST_ALPHA : 0x80CA,
        BLEND_SRC_ALPHA : 0x80CB,
        CONSTANT_COLOR : 0x8001,
        ONE_MINUS_CONSTANT_COLOR : 0x8002,
        CONSTANT_ALPHA : 0x8003,
        ONE_MINUS_CONSTANT_ALPHA : 0x8004,
        BLEND_COLOR : 0x8005,
        ARRAY_BUFFER : 0x8892,
        ELEMENT_ARRAY_BUFFER : 0x8893,
        ARRAY_BUFFER_BINDING : 0x8894,
        ELEMENT_ARRAY_BUFFER_BINDING : 0x8895,
        STREAM_DRAW : 0x88E0,
        STATIC_DRAW : 0x88E4,
        DYNAMIC_DRAW : 0x88E8,
        BUFFER_SIZE : 0x8764,
        BUFFER_USAGE : 0x8765,
        CURRENT_VERTEX_ATTRIB : 0x8626,
        FRONT : 0x0404,
        BACK : 0x0405,
        FRONT_AND_BACK : 0x0408,
        CULL_FACE : 0x0B44,
        BLEND : 0x0BE2,
        DITHER : 0x0BD0,
        STENCIL_TEST : 0x0B90,
        DEPTH_TEST : 0x0B71,
        SCISSOR_TEST : 0x0C11,
        POLYGON_OFFSET_FILL : 0x8037,
        SAMPLE_ALPHA_TO_COVERAGE : 0x809E,
        SAMPLE_COVERAGE : 0x80A0,
        NO_ERROR : 0,
        INVALID_ENUM : 0x0500,
        INVALID_VALUE : 0x0501,
        INVALID_OPERATION : 0x0502,
        OUT_OF_MEMORY : 0x0505,
        CW : 0x0900,
        CCW : 0x0901,
        LINE_WIDTH : 0x0B21,
        ALIASED_POINT_SIZE_RANGE : 0x846D,
        ALIASED_LINE_WIDTH_RANGE : 0x846E,
        CULL_FACE_MODE : 0x0B45,
        FRONT_FACE : 0x0B46,
        DEPTH_RANGE : 0x0B70,
        DEPTH_WRITEMASK : 0x0B72,
        DEPTH_CLEAR_VALUE : 0x0B73,
        DEPTH_FUNC : 0x0B74,
        STENCIL_CLEAR_VALUE : 0x0B91,
        STENCIL_FUNC : 0x0B92,
        STENCIL_FAIL : 0x0B94,
        STENCIL_PASS_DEPTH_FAIL : 0x0B95,
        STENCIL_PASS_DEPTH_PASS : 0x0B96,
        STENCIL_REF : 0x0B97,
        STENCIL_VALUE_MASK : 0x0B93,
        STENCIL_WRITEMASK : 0x0B98,
        STENCIL_BACK_FUNC : 0x8800,
        STENCIL_BACK_FAIL : 0x8801,
        STENCIL_BACK_PASS_DEPTH_FAIL : 0x8802,
        STENCIL_BACK_PASS_DEPTH_PASS : 0x8803,
        STENCIL_BACK_REF : 0x8CA3,
        STENCIL_BACK_VALUE_MASK : 0x8CA4,
        STENCIL_BACK_WRITEMASK : 0x8CA5,
        VIEWPORT : 0x0BA2,
        SCISSOR_BOX : 0x0C10,
        COLOR_CLEAR_VALUE : 0x0C22,
        COLOR_WRITEMASK : 0x0C23,
        UNPACK_ALIGNMENT : 0x0CF5,
        PACK_ALIGNMENT : 0x0D05,
        MAX_TEXTURE_SIZE : 0x0D33,
        MAX_VIEWPORT_DIMS : 0x0D3A,
        SUBPIXEL_BITS : 0x0D50,
        RED_BITS : 0x0D52,
        GREEN_BITS : 0x0D53,
        BLUE_BITS : 0x0D54,
        ALPHA_BITS : 0x0D55,
        DEPTH_BITS : 0x0D56,
        STENCIL_BITS : 0x0D57,
        POLYGON_OFFSET_UNITS : 0x2A00,
        POLYGON_OFFSET_FACTOR : 0x8038,
        TEXTURE_BINDING_2D : 0x8069,
        SAMPLE_BUFFERS : 0x80A8,
        SAMPLES : 0x80A9,
        SAMPLE_COVERAGE_VALUE : 0x80AA,
        SAMPLE_COVERAGE_INVERT : 0x80AB,
        COMPRESSED_TEXTURE_FORMATS : 0x86A3,
        DONT_CARE : 0x1100,
        FASTEST : 0x1101,
        NICEST : 0x1102,
        GENERATE_MIPMAP_HINT : 0x8192,
        BYTE : 0x1400,
        UNSIGNED_BYTE : 0x1401,
        SHORT : 0x1402,
        UNSIGNED_SHORT : 0x1403,
        INT : 0x1404,
        UNSIGNED_INT : 0x1405,
        FLOAT : 0x1406,
        DEPTH_COMPONENT : 0x1902,
        ALPHA : 0x1906,
        RGB : 0x1907,
        RGBA : 0x1908,
        LUMINANCE : 0x1909,
        LUMINANCE_ALPHA : 0x190A,
        UNSIGNED_SHORT_4_4_4_4 : 0x8033,
        UNSIGNED_SHORT_5_5_5_1 : 0x8034,
        UNSIGNED_SHORT_5_6_5 : 0x8363,
        FRAGMENT_SHADER : 0x8B30,
        VERTEX_SHADER : 0x8B31,
        MAX_VERTEX_ATTRIBS : 0x8869,
        MAX_VERTEX_UNIFORM_VECTORS : 0x8DFB,
        MAX_VARYING_VECTORS : 0x8DFC,
        MAX_COMBINED_TEXTURE_IMAGE_UNITS : 0x8B4D,
        MAX_VERTEX_TEXTURE_IMAGE_UNITS : 0x8B4C,
        MAX_TEXTURE_IMAGE_UNITS : 0x8872,
        MAX_FRAGMENT_UNIFORM_VECTORS : 0x8DFD,
        SHADER_TYPE : 0x8B4F,
        DELETE_STATUS : 0x8B80,
        LINK_STATUS : 0x8B82,
        VALIDATE_STATUS : 0x8B83,
        ATTACHED_SHADERS : 0x8B85,
        ACTIVE_UNIFORMS : 0x8B86,
        ACTIVE_ATTRIBUTES : 0x8B89,
        SHADING_LANGUAGE_VERSION : 0x8B8C,
        CURRENT_PROGRAM : 0x8B8D,
        NEVER : 0x0200,
        LESS : 0x0201,
        EQUAL : 0x0202,
        LEQUAL : 0x0203,
        GREATER : 0x0204,
        NOTEQUAL : 0x0205,
        GEQUAL : 0x0206,
        ALWAYS : 0x0207,
        KEEP : 0x1E00,
        REPLACE : 0x1E01,
        INCR : 0x1E02,
        DECR : 0x1E03,
        INVERT : 0x150A,
        INCR_WRAP : 0x8507,
        DECR_WRAP : 0x8508,
        VENDOR : 0x1F00,
        RENDERER : 0x1F01,
        VERSION : 0x1F02,
        NEAREST : 0x2600,
        LINEAR : 0x2601,
        NEAREST_MIPMAP_NEAREST : 0x2700,
        LINEAR_MIPMAP_NEAREST : 0x2701,
        NEAREST_MIPMAP_LINEAR : 0x2702,
        LINEAR_MIPMAP_LINEAR : 0x2703,
        TEXTURE_MAG_FILTER : 0x2800,
        TEXTURE_MIN_FILTER : 0x2801,
        TEXTURE_WRAP_S : 0x2802,
        TEXTURE_WRAP_T : 0x2803,
        TEXTURE_2D : 0x0DE1,
        TEXTURE : 0x1702,
        TEXTURE_CUBE_MAP : 0x8513,
        TEXTURE_BINDING_CUBE_MAP : 0x8514,
        TEXTURE_CUBE_MAP_POSITIVE_X : 0x8515,
        TEXTURE_CUBE_MAP_NEGATIVE_X : 0x8516,
        TEXTURE_CUBE_MAP_POSITIVE_Y : 0x8517,
        TEXTURE_CUBE_MAP_NEGATIVE_Y : 0x8518,
        TEXTURE_CUBE_MAP_POSITIVE_Z : 0x8519,
        TEXTURE_CUBE_MAP_NEGATIVE_Z : 0x851A,
        MAX_CUBE_MAP_TEXTURE_SIZE : 0x851C,
        TEXTURE0 : 0x84C0,
        TEXTURE1 : 0x84C1,
        TEXTURE2 : 0x84C2,
        TEXTURE3 : 0x84C3,
        TEXTURE4 : 0x84C4,
        TEXTURE5 : 0x84C5,
        TEXTURE6 : 0x84C6,
        TEXTURE7 : 0x84C7,
        TEXTURE8 : 0x84C8,
        TEXTURE9 : 0x84C9,
        TEXTURE10 : 0x84CA,
        TEXTURE11 : 0x84CB,
        TEXTURE12 : 0x84CC,
        TEXTURE13 : 0x84CD,
        TEXTURE14 : 0x84CE,
        TEXTURE15 : 0x84CF,
        TEXTURE16 : 0x84D0,
        TEXTURE17 : 0x84D1,
        TEXTURE18 : 0x84D2,
        TEXTURE19 : 0x84D3,
        TEXTURE20 : 0x84D4,
        TEXTURE21 : 0x84D5,
        TEXTURE22 : 0x84D6,
        TEXTURE23 : 0x84D7,
        TEXTURE24 : 0x84D8,
        TEXTURE25 : 0x84D9,
        TEXTURE26 : 0x84DA,
        TEXTURE27 : 0x84DB,
        TEXTURE28 : 0x84DC,
        TEXTURE29 : 0x84DD,
        TEXTURE30 : 0x84DE,
        TEXTURE31 : 0x84DF,
        ACTIVE_TEXTURE : 0x84E0,
        REPEAT : 0x2901,
        CLAMP_TO_EDGE : 0x812F,
        MIRRORED_REPEAT : 0x8370,
        FLOAT_VEC2 : 0x8B50,
        FLOAT_VEC3 : 0x8B51,
        FLOAT_VEC4 : 0x8B52,
        INT_VEC2 : 0x8B53,
        INT_VEC3 : 0x8B54,
        INT_VEC4 : 0x8B55,
        BOOL : 0x8B56,
        BOOL_VEC2 : 0x8B57,
        BOOL_VEC3 : 0x8B58,
        BOOL_VEC4 : 0x8B59,
        FLOAT_MAT2 : 0x8B5A,
        FLOAT_MAT3 : 0x8B5B,
        FLOAT_MAT4 : 0x8B5C,
        SAMPLER_2D : 0x8B5E,
        SAMPLER_CUBE : 0x8B60,
        VERTEX_ATTRIB_ARRAY_ENABLED : 0x8622,
        VERTEX_ATTRIB_ARRAY_SIZE : 0x8623,
        VERTEX_ATTRIB_ARRAY_STRIDE : 0x8624,
        VERTEX_ATTRIB_ARRAY_TYPE : 0x8625,
        VERTEX_ATTRIB_ARRAY_NORMALIZED : 0x886A,
        VERTEX_ATTRIB_ARRAY_POINTER : 0x8645,
        VERTEX_ATTRIB_ARRAY_BUFFER_BINDING : 0x889F,
        IMPLEMENTATION_COLOR_READ_TYPE : 0x8B9A,
        IMPLEMENTATION_COLOR_READ_FORMAT : 0x8B9B,
        COMPILE_STATUS : 0x8B81,
        LOW_FLOAT : 0x8DF0,
        MEDIUM_FLOAT : 0x8DF1,
        HIGH_FLOAT : 0x8DF2,
        LOW_INT : 0x8DF3,
        MEDIUM_INT : 0x8DF4,
        HIGH_INT : 0x8DF5,
        FRAMEBUFFER : 0x8D40,
        RENDERBUFFER : 0x8D41,
        RGBA4 : 0x8056,
        RGB5_A1 : 0x8057,
        RGB565 : 0x8D62,
        DEPTH_COMPONENT16 : 0x81A5,
        STENCIL_INDEX : 0x1901,
        STENCIL_INDEX8 : 0x8D48,
        DEPTH_STENCIL : 0x84F9,
        RENDERBUFFER_WIDTH : 0x8D42,
        RENDERBUFFER_HEIGHT : 0x8D43,
        RENDERBUFFER_INTERNAL_FORMAT : 0x8D44,
        RENDERBUFFER_RED_SIZE : 0x8D50,
        RENDERBUFFER_GREEN_SIZE : 0x8D51,
        RENDERBUFFER_BLUE_SIZE : 0x8D52,
        RENDERBUFFER_ALPHA_SIZE : 0x8D53,
        RENDERBUFFER_DEPTH_SIZE : 0x8D54,
        RENDERBUFFER_STENCIL_SIZE : 0x8D55,
        FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE : 0x8CD0,
        FRAMEBUFFER_ATTACHMENT_OBJECT_NAME : 0x8CD1,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL : 0x8CD2,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE : 0x8CD3,
        COLOR_ATTACHMENT0 : 0x8CE0,
        DEPTH_ATTACHMENT : 0x8D00,
        STENCIL_ATTACHMENT : 0x8D20,
        DEPTH_STENCIL_ATTACHMENT : 0x821A,
        NONE : 0,
        FRAMEBUFFER_COMPLETE : 0x8CD5,
        FRAMEBUFFER_INCOMPLETE_ATTACHMENT : 0x8CD6,
        FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT : 0x8CD7,
        FRAMEBUFFER_INCOMPLETE_DIMENSIONS : 0x8CD9,
        FRAMEBUFFER_UNSUPPORTED : 0x8CDD,
        FRAMEBUFFER_BINDING : 0x8CA6,
        RENDERBUFFER_BINDING : 0x8CA7,
        MAX_RENDERBUFFER_SIZE : 0x84E8,
        INVALID_FRAMEBUFFER_OPERATION : 0x0506,
        UNPACK_FLIP_Y_WEBGL : 0x9240,
        UNPACK_PREMULTIPLY_ALPHA_WEBGL : 0x9241,
        CONTEXT_LOST_WEBGL : 0x9242,
        UNPACK_COLORSPACE_CONVERSION_WEBGL : 0x9243,
        BROWSER_DEFAULT_WEBGL : 0x9244,

        // WEBGL_compressed_texture_s3tc
        COMPRESSED_RGB_S3TC_DXT1_EXT : 0x83F0,
        COMPRESSED_RGBA_S3TC_DXT1_EXT : 0x83F1,
        COMPRESSED_RGBA_S3TC_DXT3_EXT : 0x83F2,
        COMPRESSED_RGBA_S3TC_DXT5_EXT : 0x83F3,

        // WEBGL_compressed_texture_pvrtc
        COMPRESSED_RGB_PVRTC_4BPPV1_IMG : 0x8C00,
        COMPRESSED_RGB_PVRTC_2BPPV1_IMG : 0x8C01,
        COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : 0x8C02,
        COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : 0x8C03,

        // WEBGL_compressed_texture_etc1
        COMPRESSED_RGB_ETC1_WEBGL : 0x8D64,

        // Desktop OpenGL
        DOUBLE : 0x140A,

        // WebGL 2
        READ_BUFFER : 0x0C02,
        UNPACK_ROW_LENGTH : 0x0CF2,
        UNPACK_SKIP_ROWS : 0x0CF3,
        UNPACK_SKIP_PIXELS : 0x0CF4,
        PACK_ROW_LENGTH : 0x0D02,
        PACK_SKIP_ROWS : 0x0D03,
        PACK_SKIP_PIXELS : 0x0D04,
        COLOR : 0x1800,
        DEPTH : 0x1801,
        STENCIL : 0x1802,
        RED : 0x1903,
        RGB8 : 0x8051,
        RGBA8 : 0x8058,
        RGB10_A2 : 0x8059,
        TEXTURE_BINDING_3D : 0x806A,
        UNPACK_SKIP_IMAGES : 0x806D,
        UNPACK_IMAGE_HEIGHT : 0x806E,
        TEXTURE_3D : 0x806F,
        TEXTURE_WRAP_R : 0x8072,
        MAX_3D_TEXTURE_SIZE : 0x8073,
        UNSIGNED_INT_2_10_10_10_REV : 0x8368,
        MAX_ELEMENTS_VERTICES : 0x80E8,
        MAX_ELEMENTS_INDICES : 0x80E9,
        TEXTURE_MIN_LOD : 0x813A,
        TEXTURE_MAX_LOD : 0x813B,
        TEXTURE_BASE_LEVEL : 0x813C,
        TEXTURE_MAX_LEVEL : 0x813D,
        MIN : 0x8007,
        MAX : 0x8008,
        DEPTH_COMPONENT24 : 0x81A6,
        MAX_TEXTURE_LOD_BIAS : 0x84FD,
        TEXTURE_COMPARE_MODE : 0x884C,
        TEXTURE_COMPARE_FUNC : 0x884D,
        CURRENT_QUERY : 0x8865,
        QUERY_RESULT : 0x8866,
        QUERY_RESULT_AVAILABLE : 0x8867,
        STREAM_READ : 0x88E1,
        STREAM_COPY : 0x88E2,
        STATIC_READ : 0x88E5,
        STATIC_COPY : 0x88E6,
        DYNAMIC_READ : 0x88E9,
        DYNAMIC_COPY : 0x88EA,
        MAX_DRAW_BUFFERS : 0x8824,
        DRAW_BUFFER0 : 0x8825,
        DRAW_BUFFER1 : 0x8826,
        DRAW_BUFFER2 : 0x8827,
        DRAW_BUFFER3 : 0x8828,
        DRAW_BUFFER4 : 0x8829,
        DRAW_BUFFER5 : 0x882A,
        DRAW_BUFFER6 : 0x882B,
        DRAW_BUFFER7 : 0x882C,
        DRAW_BUFFER8 : 0x882D,
        DRAW_BUFFER9 : 0x882E,
        DRAW_BUFFER10 : 0x882F,
        DRAW_BUFFER11 : 0x8830,
        DRAW_BUFFER12 : 0x8831,
        DRAW_BUFFER13 : 0x8832,
        DRAW_BUFFER14 : 0x8833,
        DRAW_BUFFER15 : 0x8834,
        MAX_FRAGMENT_UNIFORM_COMPONENTS : 0x8B49,
        MAX_VERTEX_UNIFORM_COMPONENTS : 0x8B4A,
        SAMPLER_3D : 0x8B5F,
        SAMPLER_2D_SHADOW : 0x8B62,
        FRAGMENT_SHADER_DERIVATIVE_HINT : 0x8B8B,
        PIXEL_PACK_BUFFER : 0x88EB,
        PIXEL_UNPACK_BUFFER : 0x88EC,
        PIXEL_PACK_BUFFER_BINDING : 0x88ED,
        PIXEL_UNPACK_BUFFER_BINDING : 0x88EF,
        FLOAT_MAT2x3 : 0x8B65,
        FLOAT_MAT2x4 : 0x8B66,
        FLOAT_MAT3x2 : 0x8B67,
        FLOAT_MAT3x4 : 0x8B68,
        FLOAT_MAT4x2 : 0x8B69,
        FLOAT_MAT4x3 : 0x8B6A,
        SRGB : 0x8C40,
        SRGB8 : 0x8C41,
        SRGB8_ALPHA8 : 0x8C43,
        COMPARE_REF_TO_TEXTURE : 0x884E,
        RGBA32F : 0x8814,
        RGB32F : 0x8815,
        RGBA16F : 0x881A,
        RGB16F : 0x881B,
        VERTEX_ATTRIB_ARRAY_INTEGER : 0x88FD,
        MAX_ARRAY_TEXTURE_LAYERS : 0x88FF,
        MIN_PROGRAM_TEXEL_OFFSET : 0x8904,
        MAX_PROGRAM_TEXEL_OFFSET : 0x8905,
        MAX_VARYING_COMPONENTS : 0x8B4B,
        TEXTURE_2D_ARRAY : 0x8C1A,
        TEXTURE_BINDING_2D_ARRAY : 0x8C1D,
        R11F_G11F_B10F : 0x8C3A,
        UNSIGNED_INT_10F_11F_11F_REV : 0x8C3B,
        RGB9_E5 : 0x8C3D,
        UNSIGNED_INT_5_9_9_9_REV : 0x8C3E,
        TRANSFORM_FEEDBACK_BUFFER_MODE : 0x8C7F,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS : 0x8C80,
        TRANSFORM_FEEDBACK_VARYINGS : 0x8C83,
        TRANSFORM_FEEDBACK_BUFFER_START : 0x8C84,
        TRANSFORM_FEEDBACK_BUFFER_SIZE : 0x8C85,
        TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN : 0x8C88,
        RASTERIZER_DISCARD : 0x8C89,
        MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS : 0x8C8A,
        MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS : 0x8C8B,
        INTERLEAVED_ATTRIBS : 0x8C8C,
        SEPARATE_ATTRIBS : 0x8C8D,
        TRANSFORM_FEEDBACK_BUFFER : 0x8C8E,
        TRANSFORM_FEEDBACK_BUFFER_BINDING : 0x8C8F,
        RGBA32UI : 0x8D70,
        RGB32UI : 0x8D71,
        RGBA16UI : 0x8D76,
        RGB16UI : 0x8D77,
        RGBA8UI : 0x8D7C,
        RGB8UI : 0x8D7D,
        RGBA32I : 0x8D82,
        RGB32I : 0x8D83,
        RGBA16I : 0x8D88,
        RGB16I : 0x8D89,
        RGBA8I : 0x8D8E,
        RGB8I : 0x8D8F,
        RED_INTEGER : 0x8D94,
        RGB_INTEGER : 0x8D98,
        RGBA_INTEGER : 0x8D99,
        SAMPLER_2D_ARRAY : 0x8DC1,
        SAMPLER_2D_ARRAY_SHADOW : 0x8DC4,
        SAMPLER_CUBE_SHADOW : 0x8DC5,
        UNSIGNED_INT_VEC2 : 0x8DC6,
        UNSIGNED_INT_VEC3 : 0x8DC7,
        UNSIGNED_INT_VEC4 : 0x8DC8,
        INT_SAMPLER_2D : 0x8DCA,
        INT_SAMPLER_3D : 0x8DCB,
        INT_SAMPLER_CUBE : 0x8DCC,
        INT_SAMPLER_2D_ARRAY : 0x8DCF,
        UNSIGNED_INT_SAMPLER_2D : 0x8DD2,
        UNSIGNED_INT_SAMPLER_3D : 0x8DD3,
        UNSIGNED_INT_SAMPLER_CUBE : 0x8DD4,
        UNSIGNED_INT_SAMPLER_2D_ARRAY : 0x8DD7,
        DEPTH_COMPONENT32F : 0x8CAC,
        DEPTH32F_STENCIL8 : 0x8CAD,
        FLOAT_32_UNSIGNED_INT_24_8_REV : 0x8DAD,
        FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING : 0x8210,
        FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE : 0x8211,
        FRAMEBUFFER_ATTACHMENT_RED_SIZE : 0x8212,
        FRAMEBUFFER_ATTACHMENT_GREEN_SIZE : 0x8213,
        FRAMEBUFFER_ATTACHMENT_BLUE_SIZE : 0x8214,
        FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE : 0x8215,
        FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE : 0x8216,
        FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE : 0x8217,
        FRAMEBUFFER_DEFAULT : 0x8218,
        UNSIGNED_INT_24_8 : 0x84FA,
        DEPTH24_STENCIL8 : 0x88F0,
        UNSIGNED_NORMALIZED : 0x8C17,
        DRAW_FRAMEBUFFER_BINDING : 0x8CA6, // Same as FRAMEBUFFER_BINDING
        READ_FRAMEBUFFER : 0x8CA8,
        DRAW_FRAMEBUFFER : 0x8CA9,
        READ_FRAMEBUFFER_BINDING : 0x8CAA,
        RENDERBUFFER_SAMPLES : 0x8CAB,
        FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER : 0x8CD4,
        MAX_COLOR_ATTACHMENTS : 0x8CDF,
        COLOR_ATTACHMENT1 : 0x8CE1,
        COLOR_ATTACHMENT2 : 0x8CE2,
        COLOR_ATTACHMENT3 : 0x8CE3,
        COLOR_ATTACHMENT4 : 0x8CE4,
        COLOR_ATTACHMENT5 : 0x8CE5,
        COLOR_ATTACHMENT6 : 0x8CE6,
        COLOR_ATTACHMENT7 : 0x8CE7,
        COLOR_ATTACHMENT8 : 0x8CE8,
        COLOR_ATTACHMENT9 : 0x8CE9,
        COLOR_ATTACHMENT10 : 0x8CEA,
        COLOR_ATTACHMENT11 : 0x8CEB,
        COLOR_ATTACHMENT12 : 0x8CEC,
        COLOR_ATTACHMENT13 : 0x8CED,
        COLOR_ATTACHMENT14 : 0x8CEE,
        COLOR_ATTACHMENT15 : 0x8CEF,
        FRAMEBUFFER_INCOMPLETE_MULTISAMPLE : 0x8D56,
        MAX_SAMPLES : 0x8D57,
        HALF_FLOAT : 0x140B,
        RG : 0x8227,
        RG_INTEGER : 0x8228,
        R8 : 0x8229,
        RG8 : 0x822B,
        R16F : 0x822D,
        R32F : 0x822E,
        RG16F : 0x822F,
        RG32F : 0x8230,
        R8I : 0x8231,
        R8UI : 0x8232,
        R16I : 0x8233,
        R16UI : 0x8234,
        R32I : 0x8235,
        R32UI : 0x8236,
        RG8I : 0x8237,
        RG8UI : 0x8238,
        RG16I : 0x8239,
        RG16UI : 0x823A,
        RG32I : 0x823B,
        RG32UI : 0x823C,
        VERTEX_ARRAY_BINDING : 0x85B5,
        R8_SNORM : 0x8F94,
        RG8_SNORM : 0x8F95,
        RGB8_SNORM : 0x8F96,
        RGBA8_SNORM : 0x8F97,
        SIGNED_NORMALIZED : 0x8F9C,
        COPY_READ_BUFFER : 0x8F36,
        COPY_WRITE_BUFFER : 0x8F37,
        COPY_READ_BUFFER_BINDING : 0x8F36, // Same as COPY_READ_BUFFER
        COPY_WRITE_BUFFER_BINDING : 0x8F37, // Same as COPY_WRITE_BUFFER
        UNIFORM_BUFFER : 0x8A11,
        UNIFORM_BUFFER_BINDING : 0x8A28,
        UNIFORM_BUFFER_START : 0x8A29,
        UNIFORM_BUFFER_SIZE : 0x8A2A,
        MAX_VERTEX_UNIFORM_BLOCKS : 0x8A2B,
        MAX_FRAGMENT_UNIFORM_BLOCKS : 0x8A2D,
        MAX_COMBINED_UNIFORM_BLOCKS : 0x8A2E,
        MAX_UNIFORM_BUFFER_BINDINGS : 0x8A2F,
        MAX_UNIFORM_BLOCK_SIZE : 0x8A30,
        MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS : 0x8A31,
        MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS : 0x8A33,
        UNIFORM_BUFFER_OFFSET_ALIGNMENT : 0x8A34,
        ACTIVE_UNIFORM_BLOCKS : 0x8A36,
        UNIFORM_TYPE : 0x8A37,
        UNIFORM_SIZE : 0x8A38,
        UNIFORM_BLOCK_INDEX : 0x8A3A,
        UNIFORM_OFFSET : 0x8A3B,
        UNIFORM_ARRAY_STRIDE : 0x8A3C,
        UNIFORM_MATRIX_STRIDE : 0x8A3D,
        UNIFORM_IS_ROW_MAJOR : 0x8A3E,
        UNIFORM_BLOCK_BINDING : 0x8A3F,
        UNIFORM_BLOCK_DATA_SIZE : 0x8A40,
        UNIFORM_BLOCK_ACTIVE_UNIFORMS : 0x8A42,
        UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES : 0x8A43,
        UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER : 0x8A44,
        UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER : 0x8A46,
        INVALID_INDEX : 0xFFFFFFFF,
        MAX_VERTEX_OUTPUT_COMPONENTS : 0x9122,
        MAX_FRAGMENT_INPUT_COMPONENTS : 0x9125,
        MAX_SERVER_WAIT_TIMEOUT : 0x9111,
        OBJECT_TYPE : 0x9112,
        SYNC_CONDITION : 0x9113,
        SYNC_STATUS : 0x9114,
        SYNC_FLAGS : 0x9115,
        SYNC_FENCE : 0x9116,
        SYNC_GPU_COMMANDS_COMPLETE : 0x9117,
        UNSIGNALED : 0x9118,
        SIGNALED : 0x9119,
        ALREADY_SIGNALED : 0x911A,
        TIMEOUT_EXPIRED : 0x911B,
        CONDITION_SATISFIED : 0x911C,
        WAIT_FAILED : 0x911D,
        SYNC_FLUSH_COMMANDS_BIT : 0x00000001,
        VERTEX_ATTRIB_ARRAY_DIVISOR : 0x88FE,
        ANY_SAMPLES_PASSED : 0x8C2F,
        ANY_SAMPLES_PASSED_CONSERVATIVE : 0x8D6A,
        SAMPLER_BINDING : 0x8919,
        RGB10_A2UI : 0x906F,
        INT_2_10_10_10_REV : 0x8D9F,
        TRANSFORM_FEEDBACK : 0x8E22,
        TRANSFORM_FEEDBACK_PAUSED : 0x8E23,
        TRANSFORM_FEEDBACK_ACTIVE : 0x8E24,
        TRANSFORM_FEEDBACK_BINDING : 0x8E25,
        COMPRESSED_R11_EAC : 0x9270,
        COMPRESSED_SIGNED_R11_EAC : 0x9271,
        COMPRESSED_RG11_EAC : 0x9272,
        COMPRESSED_SIGNED_RG11_EAC : 0x9273,
        COMPRESSED_RGB8_ETC2 : 0x9274,
        COMPRESSED_SRGB8_ETC2 : 0x9275,
        COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 : 0x9276,
        COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 : 0x9277,
        COMPRESSED_RGBA8_ETC2_EAC : 0x9278,
        COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : 0x9279,
        TEXTURE_IMMUTABLE_FORMAT : 0x912F,
        MAX_ELEMENT_INDEX : 0x8D6B,
        TEXTURE_IMMUTABLE_LEVELS : 0x82DF,

        // Extensions
        MAX_TEXTURE_MAX_ANISOTROPY_EXT : 0x84FF
    };

    return freezeObject(WebGLConstants);
});

define('Renderer/PixelDatatype',[
        '../Core/freezeObject',
        '../Core/WebGLConstants'
    ], function(
        freezeObject,
        WebGLConstants) {
    'use strict';

    /**
     * @private
     */
    var PixelDatatype = {
        UNSIGNED_BYTE : WebGLConstants.UNSIGNED_BYTE,
        UNSIGNED_SHORT : WebGLConstants.UNSIGNED_SHORT,
        UNSIGNED_INT : WebGLConstants.UNSIGNED_INT,
        FLOAT : WebGLConstants.FLOAT,
        UNSIGNED_INT_24_8 : WebGLConstants.UNSIGNED_INT_24_8,
        UNSIGNED_SHORT_4_4_4_4 : WebGLConstants.UNSIGNED_SHORT_4_4_4_4,
        UNSIGNED_SHORT_5_5_5_1 : WebGLConstants.UNSIGNED_SHORT_5_5_5_1,
        UNSIGNED_SHORT_5_6_5 : WebGLConstants.UNSIGNED_SHORT_5_6_5,

        isPacked : function(pixelDatatype) {
            return pixelDatatype === PixelDatatype.UNSIGNED_INT_24_8 ||
                   pixelDatatype === PixelDatatype.UNSIGNED_SHORT_4_4_4_4 ||
                   pixelDatatype === PixelDatatype.UNSIGNED_SHORT_5_5_5_1 ||
                   pixelDatatype === PixelDatatype.UNSIGNED_SHORT_5_6_5;
        },

        sizeInBytes : function(pixelDatatype) {
            switch (pixelDatatype) {
                case PixelDatatype.UNSIGNED_BYTE:
                    return 1;
                case PixelDatatype.UNSIGNED_SHORT:
                case PixelDatatype.UNSIGNED_SHORT_4_4_4_4:
                case PixelDatatype.UNSIGNED_SHORT_5_5_5_1:
                case PixelDatatype.UNSIGNED_SHORT_5_6_5:
                    return 2;
                case PixelDatatype.UNSIGNED_INT:
                case PixelDatatype.FLOAT:
                case PixelDatatype.UNSIGNED_INT_24_8:
                    return 4;
            }
        },

        validate : function(pixelDatatype) {
            return ((pixelDatatype === PixelDatatype.UNSIGNED_BYTE) ||
                    (pixelDatatype === PixelDatatype.UNSIGNED_SHORT) ||
                    (pixelDatatype === PixelDatatype.UNSIGNED_INT) ||
                    (pixelDatatype === PixelDatatype.FLOAT) ||
                    (pixelDatatype === PixelDatatype.UNSIGNED_INT_24_8) ||
                    (pixelDatatype === PixelDatatype.UNSIGNED_SHORT_4_4_4_4) ||
                    (pixelDatatype === PixelDatatype.UNSIGNED_SHORT_5_5_5_1) ||
                    (pixelDatatype === PixelDatatype.UNSIGNED_SHORT_5_6_5));
        }
    };

    return freezeObject(PixelDatatype);
});

define('Core/PixelFormat',[
        '../Renderer/PixelDatatype',
        './freezeObject',
        './WebGLConstants'
    ], function(
        PixelDatatype,
        freezeObject,
        WebGLConstants) {
    'use strict';

    /**
     * The format of a pixel, i.e., the number of components it has and what they represent.
     *
     * @exports PixelFormat
     */
    var PixelFormat = {
        /**
         * A pixel format containing a depth value.
         *
         * @type {Number}
         * @constant
         */
        DEPTH_COMPONENT : WebGLConstants.DEPTH_COMPONENT,

        /**
         * A pixel format containing a depth and stencil value, most often used with {@link PixelDatatype.UNSIGNED_INT_24_8}.
         *
         * @type {Number}
         * @constant
         */
        DEPTH_STENCIL : WebGLConstants.DEPTH_STENCIL,

        /**
         * A pixel format containing an alpha channel.
         *
         * @type {Number}
         * @constant
         */
        ALPHA : WebGLConstants.ALPHA,

        /**
         * A pixel format containing red, green, and blue channels.
         *
         * @type {Number}
         * @constant
         */
        RGB : WebGLConstants.RGB,

        /**
         * A pixel format containing red, green, blue, and alpha channels.
         *
         * @type {Number}
         * @constant
         */
        RGBA : WebGLConstants.RGBA,

        /**
         * A pixel format containing a luminance (intensity) channel.
         *
         * @type {Number}
         * @constant
         */
        LUMINANCE : WebGLConstants.LUMINANCE,

        /**
         * A pixel format containing luminance (intensity) and alpha channels.
         *
         * @type {Number}
         * @constant
         */
        LUMINANCE_ALPHA : WebGLConstants.LUMINANCE_ALPHA,

        /**
         * A pixel format containing red, green, and blue channels that is DXT1 compressed.
         *
         * @type {Number}
         * @constant
         */
        RGB_DXT1 : WebGLConstants.COMPRESSED_RGB_S3TC_DXT1_EXT,

        /**
         * A pixel format containing red, green, blue, and alpha channels that is DXT1 compressed.
         *
         * @type {Number}
         * @constant
         */
        RGBA_DXT1 : WebGLConstants.COMPRESSED_RGBA_S3TC_DXT1_EXT,

        /**
         * A pixel format containing red, green, blue, and alpha channels that is DXT3 compressed.
         *
         * @type {Number}
         * @constant
         */
        RGBA_DXT3 : WebGLConstants.COMPRESSED_RGBA_S3TC_DXT3_EXT,

        /**
         * A pixel format containing red, green, blue, and alpha channels that is DXT5 compressed.
         *
         * @type {Number}
         * @constant
         */
        RGBA_DXT5 : WebGLConstants.COMPRESSED_RGBA_S3TC_DXT5_EXT,

        /**
         * A pixel format containing red, green, and blue channels that is PVR 4bpp compressed.
         *
         * @type {Number}
         * @constant
         */
        RGB_PVRTC_4BPPV1 : WebGLConstants.COMPRESSED_RGB_PVRTC_4BPPV1_IMG,

        /**
         * A pixel format containing red, green, and blue channels that is PVR 2bpp compressed.
         *
         * @type {Number}
         * @constant
         */
        RGB_PVRTC_2BPPV1 : WebGLConstants.COMPRESSED_RGB_PVRTC_2BPPV1_IMG,

        /**
         * A pixel format containing red, green, blue, and alpha channels that is PVR 4bpp compressed.
         *
         * @type {Number}
         * @constant
         */
        RGBA_PVRTC_4BPPV1 : WebGLConstants.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,

        /**
         * A pixel format containing red, green, blue, and alpha channels that is PVR 2bpp compressed.
         *
         * @type {Number}
         * @constant
         */
        RGBA_PVRTC_2BPPV1 : WebGLConstants.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG,

        /**
         * A pixel format containing red, green, and blue channels that is ETC1 compressed.
         *
         * @type {Number}
         * @constant
         */
        RGB_ETC1 : WebGLConstants.COMPRESSED_RGB_ETC1_WEBGL,

        /**
         * @private
         */
        componentsLength : function(pixelFormat) {
            switch (pixelFormat) {
                // Many GPUs store RGB as RGBA internally
                // https://devtalk.nvidia.com/default/topic/699479/general-graphics-programming/rgb-auto-converted-to-rgba/post/4142379/#4142379
                case PixelFormat.RGB:
                case PixelFormat.RGBA:
                    return 4;
                case PixelFormat.LUMINANCE_ALPHA:
                    return 2;
                case PixelFormat.ALPHA:
                case PixelFormat.LUMINANCE:
                    return 1;
                default:
                    return 1;
            }
        },

        /**
         * @private
         */
        validate : function(pixelFormat) {
            return pixelFormat === PixelFormat.DEPTH_COMPONENT ||
                   pixelFormat === PixelFormat.DEPTH_STENCIL ||
                   pixelFormat === PixelFormat.ALPHA ||
                   pixelFormat === PixelFormat.RGB ||
                   pixelFormat === PixelFormat.RGBA ||
                   pixelFormat === PixelFormat.LUMINANCE ||
                   pixelFormat === PixelFormat.LUMINANCE_ALPHA ||
                   pixelFormat === PixelFormat.RGB_DXT1 ||
                   pixelFormat === PixelFormat.RGBA_DXT1 ||
                   pixelFormat === PixelFormat.RGBA_DXT3 ||
                   pixelFormat === PixelFormat.RGBA_DXT5 ||
                   pixelFormat === PixelFormat.RGB_PVRTC_4BPPV1 ||
                   pixelFormat === PixelFormat.RGB_PVRTC_2BPPV1 ||
                   pixelFormat === PixelFormat.RGBA_PVRTC_4BPPV1 ||
                   pixelFormat === PixelFormat.RGBA_PVRTC_2BPPV1 ||
                   pixelFormat === PixelFormat.RGB_ETC1;
        },

        /**
         * @private
         */
        isColorFormat : function(pixelFormat) {
            return pixelFormat === PixelFormat.ALPHA ||
                   pixelFormat === PixelFormat.RGB ||
                   pixelFormat === PixelFormat.RGBA ||
                   pixelFormat === PixelFormat.LUMINANCE ||
                   pixelFormat === PixelFormat.LUMINANCE_ALPHA;
        },

        /**
         * @private
         */
        isDepthFormat : function(pixelFormat) {
            return pixelFormat === PixelFormat.DEPTH_COMPONENT ||
                   pixelFormat === PixelFormat.DEPTH_STENCIL;
        },

        /**
         * @private
         */
        isCompressedFormat : function(pixelFormat) {
            return pixelFormat === PixelFormat.RGB_DXT1 ||
                   pixelFormat === PixelFormat.RGBA_DXT1 ||
                   pixelFormat === PixelFormat.RGBA_DXT3 ||
                   pixelFormat === PixelFormat.RGBA_DXT5 ||
                   pixelFormat === PixelFormat.RGB_PVRTC_4BPPV1 ||
                   pixelFormat === PixelFormat.RGB_PVRTC_2BPPV1 ||
                   pixelFormat === PixelFormat.RGBA_PVRTC_4BPPV1 ||
                   pixelFormat === PixelFormat.RGBA_PVRTC_2BPPV1 ||
                   pixelFormat === PixelFormat.RGB_ETC1;
        },

        /**
         * @private
         */
        isDXTFormat : function(pixelFormat) {
            return pixelFormat === PixelFormat.RGB_DXT1 ||
                   pixelFormat === PixelFormat.RGBA_DXT1 ||
                   pixelFormat === PixelFormat.RGBA_DXT3 ||
                   pixelFormat === PixelFormat.RGBA_DXT5;
        },

        /**
         * @private
         */
        isPVRTCFormat : function(pixelFormat) {
            return pixelFormat === PixelFormat.RGB_PVRTC_4BPPV1 ||
                   pixelFormat === PixelFormat.RGB_PVRTC_2BPPV1 ||
                   pixelFormat === PixelFormat.RGBA_PVRTC_4BPPV1 ||
                   pixelFormat === PixelFormat.RGBA_PVRTC_2BPPV1;
        },

        /**
         * @private
         */
        isETC1Format : function(pixelFormat) {
            return pixelFormat === PixelFormat.RGB_ETC1;
        },

        /**
         * @private
         */
        compressedTextureSizeInBytes : function(pixelFormat, width, height) {
            switch (pixelFormat) {
                case PixelFormat.RGB_DXT1:
                case PixelFormat.RGBA_DXT1:
                case PixelFormat.RGB_ETC1:
                    return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 8;

                case PixelFormat.RGBA_DXT3:
                case PixelFormat.RGBA_DXT5:
                    return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 16;

                case PixelFormat.RGB_PVRTC_4BPPV1:
                case PixelFormat.RGBA_PVRTC_4BPPV1:
                    return Math.floor((Math.max(width, 8) * Math.max(height, 8) * 4 + 7) / 8);

                case PixelFormat.RGB_PVRTC_2BPPV1:
                case PixelFormat.RGBA_PVRTC_2BPPV1:
                    return Math.floor((Math.max(width, 16) * Math.max(height, 8) * 2 + 7) / 8);

                default:
                    return 0;
            }
        },

        /**
         * @private
         */
        textureSizeInBytes : function(pixelFormat, pixelDatatype, width, height) {
            var componentsLength = PixelFormat.componentsLength(pixelFormat);
            if (PixelDatatype.isPacked(pixelDatatype)) {
                componentsLength = 1;
            }
            return componentsLength * PixelDatatype.sizeInBytes(pixelDatatype) * width * height;
        }
    };

    return freezeObject(PixelFormat);
});

define('Core/RuntimeError',[
        './defined'
    ], function(
        defined) {
    'use strict';

    /**
     * Constructs an exception object that is thrown due to an error that can occur at runtime, e.g.,
     * out of memory, could not compile shader, etc.  If a function may throw this
     * exception, the calling code should be prepared to catch it.
     * <br /><br />
     * On the other hand, a {@link DeveloperError} indicates an exception due
     * to a developer error, e.g., invalid argument, that usually indicates a bug in the
     * calling code.
     *
     * @alias RuntimeError
     * @constructor
     * @extends Error
     *
     * @param {String} [message] The error message for this exception.
     *
     * @see DeveloperError
     */
    function RuntimeError(message) {
        /**
         * 'RuntimeError' indicating that this exception was thrown due to a runtime error.
         * @type {String}
         * @readonly
         */
        this.name = 'RuntimeError';

        /**
         * The explanation for why this exception was thrown.
         * @type {String}
         * @readonly
         */
        this.message = message;

        //Browsers such as IE don't have a stack property until you actually throw the error.
        var stack;
        try {
            throw new Error();
        } catch (e) {
            stack = e.stack;
        }

        /**
         * The stack trace of this exception, if available.
         * @type {String}
         * @readonly
         */
        this.stack = stack;
    }

    if (defined(Object.create)) {
        RuntimeError.prototype = Object.create(Error.prototype);
        RuntimeError.prototype.constructor = RuntimeError;
    }

    RuntimeError.prototype.toString = function() {
        var str = this.name + ': ' + this.message;

        if (defined(this.stack)) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    return RuntimeError;
});

/**
 * @licence
 *
 * crunch/crnlib v1.04 - Advanced DXTn texture compression library
 * Copyright (C) 2010-2016 Richard Geldreich, Jr. and Binomial LLC http://binomial.info
 */

/**
 * @license
 *
 * crunch_lib.cpp
 *
 * Copyright (c) 2013, Evan Parker, Brandon Jones. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// The C++ code was compiled to Javascript with Emcripten.
// For instructions, see:
//    https://github.com/AnalyticalGraphicsInc/crunch

define('ThirdParty/crunch',[], function() {

    var Module;if(!Module)Module=(typeof Module!=="undefined"?Module:null)||{};var moduleOverrides={};for(var key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var ENVIRONMENT_IS_WEB=typeof window==="object";var ENVIRONMENT_IS_WORKER=typeof importScripts==="function";var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof require==="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER;var ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;if(ENVIRONMENT_IS_NODE){if(!Module["print"])Module["print"]=function print(x){process["stdout"].write(x+"\n")};if(!Module["printErr"])Module["printErr"]=function printErr(x){process["stderr"].write(x+"\n")};var nodeFS=require("fs");var nodePath=require("path");Module["read"]=function read(filename,binary){filename=nodePath["normalize"](filename);var ret=nodeFS["readFileSync"](filename);if(!ret&&filename!=nodePath["resolve"](filename)){filename=path.join(__dirname,"..","src",filename);ret=nodeFS["readFileSync"](filename)}if(ret&&!binary)ret=ret.toString();return ret};Module["readBinary"]=function readBinary(filename){var ret=Module["read"](filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};Module["load"]=function load(f){globalEval(read(f))};if(!Module["thisProgram"]){if(process["argv"].length>1){Module["thisProgram"]=process["argv"][1].replace(/\\/g,"/")}else{Module["thisProgram"]="unknown-program"}}Module["arguments"]=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",(function(ex){if(!(ex instanceof ExitStatus)){throw ex}}));Module["inspect"]=(function(){return"[Emscripten Module object]"})}else if(ENVIRONMENT_IS_SHELL){if(!Module["print"])Module["print"]=print;if(typeof printErr!="undefined")Module["printErr"]=printErr;if(typeof read!="undefined"){Module["read"]=read}else{Module["read"]=function read(){throw"no read() available (jsc?)"}}Module["readBinary"]=function readBinary(f){if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}var data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){Module["arguments"]=scriptArgs}else if(typeof arguments!="undefined"){Module["arguments"]=arguments}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){Module["read"]=function read(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(typeof arguments!="undefined"){Module["arguments"]=arguments}if(typeof console!=="undefined"){if(!Module["print"])Module["print"]=function print(x){console.log(x)};if(!Module["printErr"])Module["printErr"]=function printErr(x){console.log(x)}}else{var TRY_USE_DUMP=false;if(!Module["print"])Module["print"]=TRY_USE_DUMP&&typeof dump!=="undefined"?(function(x){dump(x)}):(function(x){})}if(ENVIRONMENT_IS_WORKER){Module["load"]=importScripts}if(typeof Module["setWindowTitle"]==="undefined"){Module["setWindowTitle"]=(function(title){document.title=title})}}else{throw"Unknown runtime environment. Where are we?"}function globalEval(x){eval.call(null,x)}if(!Module["load"]&&Module["read"]){Module["load"]=function load(f){globalEval(Module["read"](f))}}if(!Module["print"]){Module["print"]=(function(){})}if(!Module["printErr"]){Module["printErr"]=Module["print"]}if(!Module["arguments"]){Module["arguments"]=[]}if(!Module["thisProgram"]){Module["thisProgram"]="./this.program"}Module.print=Module["print"];Module.printErr=Module["printErr"];Module["preRun"]=[];Module["postRun"]=[];for(var key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}var Runtime={setTempRet0:(function(value){tempRet0=value}),getTempRet0:(function(){return tempRet0}),stackSave:(function(){return STACKTOP}),stackRestore:(function(stackTop){STACKTOP=stackTop}),getNativeTypeSize:(function(type){switch(type){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:{if(type[type.length-1]==="*"){return Runtime.QUANTUM_SIZE}else if(type[0]==="i"){var bits=parseInt(type.substr(1));assert(bits%8===0);return bits/8}else{return 0}}}}),getNativeFieldSize:(function(type){return Math.max(Runtime.getNativeTypeSize(type),Runtime.QUANTUM_SIZE)}),STACK_ALIGN:16,prepVararg:(function(ptr,type){if(type==="double"||type==="i64"){if(ptr&7){assert((ptr&7)===4);ptr+=4}}else{assert((ptr&3)===0)}return ptr}),getAlignSize:(function(type,size,vararg){if(!vararg&&(type=="i64"||type=="double"))return 8;if(!type)return Math.min(size,8);return Math.min(size||(type?Runtime.getNativeFieldSize(type):0),Runtime.QUANTUM_SIZE)}),dynCall:(function(sig,ptr,args){if(args&&args.length){if(!args.splice)args=Array.prototype.slice.call(args);args.splice(0,0,ptr);return Module["dynCall_"+sig].apply(null,args)}else{return Module["dynCall_"+sig].call(null,ptr)}}),functionPointers:[],addFunction:(function(func){for(var i=0;i<Runtime.functionPointers.length;i++){if(!Runtime.functionPointers[i]){Runtime.functionPointers[i]=func;return 2*(1+i)}}throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."}),removeFunction:(function(index){Runtime.functionPointers[(index-2)/2]=null}),warnOnce:(function(text){if(!Runtime.warnOnce.shown)Runtime.warnOnce.shown={};if(!Runtime.warnOnce.shown[text]){Runtime.warnOnce.shown[text]=1;Module.printErr(text)}}),funcWrappers:{},getFuncWrapper:(function(func,sig){assert(sig);if(!Runtime.funcWrappers[sig]){Runtime.funcWrappers[sig]={}}var sigCache=Runtime.funcWrappers[sig];if(!sigCache[func]){sigCache[func]=function dynCall_wrapper(){return Runtime.dynCall(sig,func,arguments)}}return sigCache[func]}),getCompilerSetting:(function(name){throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"}),stackAlloc:(function(size){var ret=STACKTOP;STACKTOP=STACKTOP+size|0;STACKTOP=STACKTOP+15&-16;return ret}),staticAlloc:(function(size){var ret=STATICTOP;STATICTOP=STATICTOP+size|0;STATICTOP=STATICTOP+15&-16;return ret}),dynamicAlloc:(function(size){var ret=DYNAMICTOP;DYNAMICTOP=DYNAMICTOP+size|0;DYNAMICTOP=DYNAMICTOP+15&-16;if(DYNAMICTOP>=TOTAL_MEMORY){var success=enlargeMemory();if(!success){DYNAMICTOP=ret;return 0}}return ret}),alignMemory:(function(size,quantum){var ret=size=Math.ceil(size/(quantum?quantum:16))*(quantum?quantum:16);return ret}),makeBigInt:(function(low,high,unsigned){var ret=unsigned?+(low>>>0)+ +(high>>>0)*+4294967296:+(low>>>0)+ +(high|0)*+4294967296;return ret}),GLOBAL_BASE:8,QUANTUM_SIZE:4,__dummy__:0};Module["Runtime"]=Runtime;var __THREW__=0;var ABORT=false;var EXITSTATUS=0;var undef=0;var tempValue,tempInt,tempBigInt,tempInt2,tempBigInt2,tempPair,tempBigIntI,tempBigIntR,tempBigIntS,tempBigIntP,tempBigIntD,tempDouble,tempFloat;var tempI64,tempI64b;var tempRet0,tempRet1,tempRet2,tempRet3,tempRet4,tempRet5,tempRet6,tempRet7,tempRet8,tempRet9;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}var globalScope=this;function getCFunc(ident){var func=Module["_"+ident];if(!func){try{func=eval("_"+ident)}catch(e){}}assert(func,"Cannot call unknown function "+ident+" (perhaps LLVM optimizations or closure removed it?)");return func}var cwrap,ccall;((function(){var JSfuncs={"stackSave":(function(){Runtime.stackSave()}),"stackRestore":(function(){Runtime.stackRestore()}),"arrayToC":(function(arr){var ret=Runtime.stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}),"stringToC":(function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=Runtime.stackAlloc((str.length<<2)+1);writeStringToMemory(str,ret)}return ret})};var toC={"string":JSfuncs["stringToC"],"array":JSfuncs["arrayToC"]};ccall=function ccallFunc(ident,returnType,argTypes,args,opts){var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=Runtime.stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);if(returnType==="string")ret=Pointer_stringify(ret);if(stack!==0){if(opts&&opts.async){EmterpreterAsync.asyncFinalizers.push((function(){Runtime.stackRestore(stack)}));return}Runtime.stackRestore(stack)}return ret};var sourceRegex=/^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;function parseJSFunc(jsfunc){var parsed=jsfunc.toString().match(sourceRegex).slice(1);return{arguments:parsed[0],body:parsed[1],returnValue:parsed[2]}}var JSsource={};for(var fun in JSfuncs){if(JSfuncs.hasOwnProperty(fun)){JSsource[fun]=parseJSFunc(JSfuncs[fun])}}cwrap=function cwrap(ident,returnType,argTypes){argTypes=argTypes||[];var cfunc=getCFunc(ident);var numericArgs=argTypes.every((function(type){return type==="number"}));var numericRet=returnType!=="string";if(numericRet&&numericArgs){return cfunc}var argNames=argTypes.map((function(x,i){return"$"+i}));var funcstr="(function("+argNames.join(",")+") {";var nargs=argTypes.length;if(!numericArgs){funcstr+="var stack = "+JSsource["stackSave"].body+";";for(var i=0;i<nargs;i++){var arg=argNames[i],type=argTypes[i];if(type==="number")continue;var convertCode=JSsource[type+"ToC"];funcstr+="var "+convertCode.arguments+" = "+arg+";";funcstr+=convertCode.body+";";funcstr+=arg+"="+convertCode.returnValue+";"}}var cfuncname=parseJSFunc((function(){return cfunc})).returnValue;funcstr+="var ret = "+cfuncname+"("+argNames.join(",")+");";if(!numericRet){var strgfy=parseJSFunc((function(){return Pointer_stringify})).returnValue;funcstr+="ret = "+strgfy+"(ret);"}if(!numericArgs){funcstr+=JSsource["stackRestore"].body.replace("()","(stack)")+";"}funcstr+="return ret})";return eval(funcstr)}}))();Module["ccall"]=ccall;Module["cwrap"]=cwrap;function setValue(ptr,value,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math_abs(tempDouble)>=+1?tempDouble>+0?(Math_min(+Math_floor(tempDouble/+4294967296),+4294967295)|0)>>>0:~~+Math_ceil((tempDouble- +(~~tempDouble>>>0))/+4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;default:abort("invalid type for setValue: "+type)}}Module["setValue"]=setValue;function getValue(ptr,type,noSafe){type=type||"i8";if(type.charAt(type.length-1)==="*")type="i32";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP32[ptr>>2];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];default:abort("invalid type for setValue: "+type)}return null}Module["getValue"]=getValue;var ALLOC_NORMAL=0;var ALLOC_STACK=1;var ALLOC_STATIC=2;var ALLOC_DYNAMIC=3;var ALLOC_NONE=4;Module["ALLOC_NORMAL"]=ALLOC_NORMAL;Module["ALLOC_STACK"]=ALLOC_STACK;Module["ALLOC_STATIC"]=ALLOC_STATIC;Module["ALLOC_DYNAMIC"]=ALLOC_DYNAMIC;Module["ALLOC_NONE"]=ALLOC_NONE;function allocate(slab,types,allocator,ptr){var zeroinit,size;if(typeof slab==="number"){zeroinit=true;size=slab}else{zeroinit=false;size=slab.length}var singleType=typeof types==="string"?types:null;var ret;if(allocator==ALLOC_NONE){ret=ptr}else{ret=[_malloc,Runtime.stackAlloc,Runtime.staticAlloc,Runtime.dynamicAlloc][allocator===undefined?ALLOC_STATIC:allocator](Math.max(size,singleType?1:types.length))}if(zeroinit){var ptr=ret,stop;assert((ret&3)==0);stop=ret+(size&~3);for(;ptr<stop;ptr+=4){HEAP32[ptr>>2]=0}stop=ret+size;while(ptr<stop){HEAP8[ptr++>>0]=0}return ret}if(singleType==="i8"){if(slab.subarray||slab.slice){HEAPU8.set(slab,ret)}else{HEAPU8.set(new Uint8Array(slab),ret)}return ret}var i=0,type,typeSize,previousType;while(i<size){var curr=slab[i];if(typeof curr==="function"){curr=Runtime.getFunctionIndex(curr)}type=singleType||types[i];if(type===0){i++;continue}if(type=="i64")type="i32";setValue(ret+i,curr,type);if(previousType!==type){typeSize=Runtime.getNativeTypeSize(type);previousType=type}i+=typeSize}return ret}Module["allocate"]=allocate;function getMemory(size){if(!staticSealed)return Runtime.staticAlloc(size);if(typeof _sbrk!=="undefined"&&!_sbrk.called||!runtimeInitialized)return Runtime.dynamicAlloc(size);return _malloc(size)}Module["getMemory"]=getMemory;function Pointer_stringify(ptr,length){if(length===0||!ptr)return"";var hasUtf=0;var t;var i=0;while(1){t=HEAPU8[ptr+i>>0];hasUtf|=t;if(t==0&&!length)break;i++;if(length&&i==length)break}if(!length)length=i;var ret="";if(hasUtf<128){var MAX_CHUNK=1024;var curr;while(length>0){curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,MAX_CHUNK)));ret=ret?ret+curr:curr;ptr+=MAX_CHUNK;length-=MAX_CHUNK}return ret}return Module["UTF8ToString"](ptr)}Module["Pointer_stringify"]=Pointer_stringify;function AsciiToString(ptr){var str="";while(1){var ch=HEAP8[ptr++>>0];if(!ch)return str;str+=String.fromCharCode(ch)}}Module["AsciiToString"]=AsciiToString;function stringToAscii(str,outPtr){return writeAsciiToMemory(str,outPtr,false)}Module["stringToAscii"]=stringToAscii;function UTF8ArrayToString(u8Array,idx){var u0,u1,u2,u3,u4,u5;var str="";while(1){u0=u8Array[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}u1=u8Array[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}u2=u8Array[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u3=u8Array[idx++]&63;if((u0&248)==240){u0=(u0&7)<<18|u1<<12|u2<<6|u3}else{u4=u8Array[idx++]&63;if((u0&252)==248){u0=(u0&3)<<24|u1<<18|u2<<12|u3<<6|u4}else{u5=u8Array[idx++]&63;u0=(u0&1)<<30|u1<<24|u2<<18|u3<<12|u4<<6|u5}}}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}Module["UTF8ArrayToString"]=UTF8ArrayToString;function UTF8ToString(ptr){return UTF8ArrayToString(HEAPU8,ptr)}Module["UTF8ToString"]=UTF8ToString;function stringToUTF8Array(str,outU8Array,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){if(outIdx>=endIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;outU8Array[outIdx++]=192|u>>6;outU8Array[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;outU8Array[outIdx++]=224|u>>12;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=2097151){if(outIdx+3>=endIdx)break;outU8Array[outIdx++]=240|u>>18;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else if(u<=67108863){if(outIdx+4>=endIdx)break;outU8Array[outIdx++]=248|u>>24;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}else{if(outIdx+5>=endIdx)break;outU8Array[outIdx++]=252|u>>30;outU8Array[outIdx++]=128|u>>24&63;outU8Array[outIdx++]=128|u>>18&63;outU8Array[outIdx++]=128|u>>12&63;outU8Array[outIdx++]=128|u>>6&63;outU8Array[outIdx++]=128|u&63}}outU8Array[outIdx]=0;return outIdx-startIdx}Module["stringToUTF8Array"]=stringToUTF8Array;function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}Module["stringToUTF8"]=stringToUTF8;function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127){++len}else if(u<=2047){len+=2}else if(u<=65535){len+=3}else if(u<=2097151){len+=4}else if(u<=67108863){len+=5}else{len+=6}}return len}Module["lengthBytesUTF8"]=lengthBytesUTF8;function UTF16ToString(ptr){var i=0;var str="";while(1){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)return str;++i;str+=String.fromCharCode(codeUnit)}}Module["UTF16ToString"]=UTF16ToString;function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>1]=0;return outPtr-startPtr}Module["stringToUTF16"]=stringToUTF16;function lengthBytesUTF16(str){return str.length*2}Module["lengthBytesUTF16"]=lengthBytesUTF16;function UTF32ToString(ptr){var i=0;var str="";while(1){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)return str;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}}Module["UTF32ToString"]=UTF32ToString;function stringToUTF32(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}Module["stringToUTF32"]=stringToUTF32;function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4}return len}Module["lengthBytesUTF32"]=lengthBytesUTF32;function demangle(func){var hasLibcxxabi=!!Module["___cxa_demangle"];if(hasLibcxxabi){try{var buf=_malloc(func.length);writeStringToMemory(func.substr(1),buf);var status=_malloc(4);var ret=Module["___cxa_demangle"](buf,0,0,status);if(getValue(status,"i32")===0&&ret){return Pointer_stringify(ret)}}catch(e){}finally{if(buf)_free(buf);if(status)_free(status);if(ret)_free(ret)}}var i=3;var basicTypes={"v":"void","b":"bool","c":"char","s":"short","i":"int","l":"long","f":"float","d":"double","w":"wchar_t","a":"signed char","h":"unsigned char","t":"unsigned short","j":"unsigned int","m":"unsigned long","x":"long long","y":"unsigned long long","z":"..."};var subs=[];var first=true;function dump(x){if(x)Module.print(x);Module.print(func);var pre="";for(var a=0;a<i;a++)pre+=" ";Module.print(pre+"^")}function parseNested(){i++;if(func[i]==="K")i++;var parts=[];while(func[i]!=="E"){if(func[i]==="S"){i++;var next=func.indexOf("_",i);var num=func.substring(i,next)||0;parts.push(subs[num]||"?");i=next+1;continue}if(func[i]==="C"){parts.push(parts[parts.length-1]);i+=2;continue}var size=parseInt(func.substr(i));var pre=size.toString().length;if(!size||!pre){i--;break}var curr=func.substr(i+pre,size);parts.push(curr);subs.push(curr);i+=pre+size}i++;return parts}function parse(rawList,limit,allowVoid){limit=limit||Infinity;var ret="",list=[];function flushList(){return"("+list.join(", ")+")"}var name;if(func[i]==="N"){name=parseNested().join("::");limit--;if(limit===0)return rawList?[name]:name}else{if(func[i]==="K"||first&&func[i]==="L")i++;var size=parseInt(func.substr(i));if(size){var pre=size.toString().length;name=func.substr(i+pre,size);i+=pre+size}}first=false;if(func[i]==="I"){i++;var iList=parse(true);var iRet=parse(true,1,true);ret+=iRet[0]+" "+name+"<"+iList.join(", ")+">"}else{ret=name}paramLoop:while(i<func.length&&limit-->0){var c=func[i++];if(c in basicTypes){list.push(basicTypes[c])}else{switch(c){case"P":list.push(parse(true,1,true)[0]+"*");break;case"R":list.push(parse(true,1,true)[0]+"&");break;case"L":{i++;var end=func.indexOf("E",i);var size=end-i;list.push(func.substr(i,size));i+=size+2;break};case"A":{var size=parseInt(func.substr(i));i+=size.toString().length;if(func[i]!=="_")throw"?";i++;list.push(parse(true,1,true)[0]+" ["+size+"]");break};case"E":break paramLoop;default:ret+="?"+c;break paramLoop}}}if(!allowVoid&&list.length===1&&list[0]==="void")list=[];if(rawList){if(ret){list.push(ret+"?")}return list}else{return ret+flushList()}}var parsed=func;try{if(func=="Object._main"||func=="_main"){return"main()"}if(typeof func==="number")func=Pointer_stringify(func);if(func[0]!=="_")return func;if(func[1]!=="_")return func;if(func[2]!=="Z")return func;switch(func[3]){case"n":return"operator new()";case"d":return"operator delete()"}parsed=parse()}catch(e){parsed+="?"}if(parsed.indexOf("?")>=0&&!hasLibcxxabi){Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling")}return parsed}function demangleAll(text){return text.replace(/__Z[\w\d_]+/g,(function(x){var y=demangle(x);return x===y?x:x+" ["+y+"]"}))}function jsStackTrace(){var err=new Error;if(!err.stack){try{throw new Error(0)}catch(e){err=e}if(!err.stack){return"(no stack trace available)"}}return err.stack.toString()}function stackTrace(){return demangleAll(jsStackTrace())}Module["stackTrace"]=stackTrace;var PAGE_SIZE=4096;function alignMemoryPage(x){if(x%4096>0){x+=4096-x%4096}return x}var HEAP;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;var STATIC_BASE=0,STATICTOP=0,staticSealed=false;var STACK_BASE=0,STACKTOP=0,STACK_MAX=0;var DYNAMIC_BASE=0,DYNAMICTOP=0;function enlargeMemory(){var OLD_TOTAL_MEMORY=TOTAL_MEMORY;var LIMIT=Math.pow(2,31);if(DYNAMICTOP>=LIMIT)return false;while(TOTAL_MEMORY<=DYNAMICTOP){if(TOTAL_MEMORY<LIMIT/2){TOTAL_MEMORY=alignMemoryPage(2*TOTAL_MEMORY)}else{var last=TOTAL_MEMORY;TOTAL_MEMORY=alignMemoryPage((3*TOTAL_MEMORY+LIMIT)/4);if(TOTAL_MEMORY<=last)return false}}TOTAL_MEMORY=Math.max(TOTAL_MEMORY,16*1024*1024);if(TOTAL_MEMORY>=LIMIT)return false;try{if(ArrayBuffer.transfer){buffer=ArrayBuffer.transfer(buffer,TOTAL_MEMORY)}else{var oldHEAP8=HEAP8;buffer=new ArrayBuffer(TOTAL_MEMORY)}}catch(e){return false}var success=_emscripten_replace_memory(buffer);if(!success)return false;Module["buffer"]=buffer;Module["HEAP8"]=HEAP8=new Int8Array(buffer);Module["HEAP16"]=HEAP16=new Int16Array(buffer);Module["HEAP32"]=HEAP32=new Int32Array(buffer);Module["HEAPU8"]=HEAPU8=new Uint8Array(buffer);Module["HEAPU16"]=HEAPU16=new Uint16Array(buffer);Module["HEAPU32"]=HEAPU32=new Uint32Array(buffer);Module["HEAPF32"]=HEAPF32=new Float32Array(buffer);Module["HEAPF64"]=HEAPF64=new Float64Array(buffer);if(!ArrayBuffer.transfer){HEAP8.set(oldHEAP8)}return true}var byteLength;try{byteLength=Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,"byteLength").get);byteLength(new ArrayBuffer(4))}catch(e){byteLength=(function(buffer){return buffer.byteLength})}var TOTAL_STACK=Module["TOTAL_STACK"]||5242880;var TOTAL_MEMORY=Module["TOTAL_MEMORY"]||16777216;var totalMemory=64*1024;while(totalMemory<TOTAL_MEMORY||totalMemory<2*TOTAL_STACK){if(totalMemory<16*1024*1024){totalMemory*=2}else{totalMemory+=16*1024*1024}}totalMemory=Math.max(totalMemory,16*1024*1024);if(totalMemory!==TOTAL_MEMORY){TOTAL_MEMORY=totalMemory}assert(typeof Int32Array!=="undefined"&&typeof Float64Array!=="undefined"&&!!(new Int32Array(1))["subarray"]&&!!(new Int32Array(1))["set"],"JS engine does not provide full typed array support");var buffer;buffer=new ArrayBuffer(TOTAL_MEMORY);HEAP8=new Int8Array(buffer);HEAP16=new Int16Array(buffer);HEAP32=new Int32Array(buffer);HEAPU8=new Uint8Array(buffer);HEAPU16=new Uint16Array(buffer);HEAPU32=new Uint32Array(buffer);HEAPF32=new Float32Array(buffer);HEAPF64=new Float64Array(buffer);HEAP32[0]=255;assert(HEAPU8[0]===255&&HEAPU8[3]===0,"Typed arrays 2 must be run on a little-endian system");Module["HEAP"]=HEAP;Module["buffer"]=buffer;Module["HEAP8"]=HEAP8;Module["HEAP16"]=HEAP16;Module["HEAP32"]=HEAP32;Module["HEAPU8"]=HEAPU8;Module["HEAPU16"]=HEAPU16;Module["HEAPU32"]=HEAPU32;Module["HEAPF32"]=HEAPF32;Module["HEAPF64"]=HEAPF64;function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback();continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){Runtime.dynCall("v",func)}else{Runtime.dynCall("vi",func,[callback.arg])}}else{func(callback.arg===undefined?null:callback.arg)}}}var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){if(runtimeInitialized)return;runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__);runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}Module["addOnPreRun"]=addOnPreRun;function addOnInit(cb){__ATINIT__.unshift(cb)}Module["addOnInit"]=addOnInit;function addOnPreMain(cb){__ATMAIN__.unshift(cb)}Module["addOnPreMain"]=addOnPreMain;function addOnExit(cb){__ATEXIT__.unshift(cb)}Module["addOnExit"]=addOnExit;function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}Module["addOnPostRun"]=addOnPostRun;function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}Module["intArrayFromString"]=intArrayFromString;function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}Module["intArrayToString"]=intArrayToString;function writeStringToMemory(string,buffer,dontAddNull){var array=intArrayFromString(string,dontAddNull);var i=0;while(i<array.length){var chr=array[i];HEAP8[buffer+i>>0]=chr;i=i+1}}Module["writeStringToMemory"]=writeStringToMemory;function writeArrayToMemory(array,buffer){for(var i=0;i<array.length;i++){HEAP8[buffer++>>0]=array[i]}}Module["writeArrayToMemory"]=writeArrayToMemory;function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}Module["writeAsciiToMemory"]=writeAsciiToMemory;function unSign(value,bits,ignore){if(value>=0){return value}return bits<=32?2*Math.abs(1<<bits-1)+value:Math.pow(2,bits)+value}function reSign(value,bits,ignore){if(value<=0){return value}var half=bits<=32?Math.abs(1<<bits-1):Math.pow(2,bits-1);if(value>=half&&(bits<=32||value>half)){value=-2*half+value}return value}if(!Math["imul"]||Math["imul"](4294967295,5)!==-5)Math["imul"]=function imul(a,b){var ah=a>>>16;var al=a&65535;var bh=b>>>16;var bl=b&65535;return al*bl+(ah*bl+al*bh<<16)|0};Math.imul=Math["imul"];if(!Math["clz32"])Math["clz32"]=(function(x){x=x>>>0;for(var i=0;i<32;i++){if(x&1<<31-i)return i}return 32});Math.clz32=Math["clz32"];var Math_abs=Math.abs;var Math_cos=Math.cos;var Math_sin=Math.sin;var Math_tan=Math.tan;var Math_acos=Math.acos;var Math_asin=Math.asin;var Math_atan=Math.atan;var Math_atan2=Math.atan2;var Math_exp=Math.exp;var Math_log=Math.log;var Math_sqrt=Math.sqrt;var Math_ceil=Math.ceil;var Math_floor=Math.floor;var Math_pow=Math.pow;var Math_imul=Math.imul;var Math_fround=Math.fround;var Math_min=Math.min;var Math_clz32=Math.clz32;var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}Module["addRunDependency"]=addRunDependency;function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["removeRunDependency"]=removeRunDependency;Module["preloadedImages"]={};Module["preloadedAudios"]={};var memoryInitializer=null;var ASM_CONSTS=[];STATIC_BASE=8;STATICTOP=STATIC_BASE+5888;__ATINIT__.push();allocate([116,0,0,0,86,7,0,0,116,0,0,0,99,7,0,0,156,0,0,0,112,7,0,0,16,0,0,0,0,0,0,0,156,0,0,0,145,7,0,0,24,0,0,0,0,0,0,0,156,0,0,0,215,7,0,0,24,0,0,0,0,0,0,0,156,0,0,0,179,7,0,0,56,0,0,0,0,0,0,0,156,0,0,0,249,7,0,0,40,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,40,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,88,0,0,0,1,0,0,0,5,0,0,0,3,0,0,0,4,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,108,1,0,0,220,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,4,0,0,0,227,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,4,0,0,0,219,16,0,0,0,4,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37,115,40,37,117,41,58,32,65,115,115,101,114,116,105,111,110,32,102,97,105,108,117,114,101,58,32,34,37,115,34,10,0,109,95,115,105,122,101,32,60,61,32,109,95,99,97,112,97,99,105,116,121,0,46,47,105,110,99,92,99,114,110,95,100,101,99,111,109,112,46,104,0,109,105,110,95,110,101,119,95,99,97,112,97,99,105,116,121,32,60,32,40,48,120,55,70,70,70,48,48,48,48,85,32,47,32,101,108,101,109,101,110,116,95,115,105,122,101,41,0,110,101,119,95,99,97,112,97,99,105,116,121,32,38,38,32,40,110,101,119,95,99,97,112,97,99,105,116,121,32,62,32,109,95,99,97,112,97,99,105,116,121,41,0,110,117,109,95,99,111,100,101,115,91,99,93,0,115,111,114,116,101,100,95,112,111,115,32,60,32,116,111,116,97,108,95,117,115,101,100,95,115,121,109,115,0,112,67,111,100,101,115,105,122,101,115,91,115,121,109,95,105,110,100,101,120,93,32,61,61,32,99,111,100,101,115,105,122,101,0,116,32,60,32,40,49,85,32,60,60,32,116,97,98,108,101,95,98,105,116,115,41,0,109,95,108,111,111,107,117,112,91,116,93,32,61,61,32,99,85,73,78,84,51,50,95,77,65,88,0,99,114,110,100,95,109,97,108,108,111,99,58,32,115,105,122,101,32,116,111,111,32,98,105,103,0,99,114,110,100,95,109,97,108,108,111,99,58,32,111,117,116,32,111,102,32,109,101,109,111,114,121,0,40,40,117,105,110,116,51,50,41,112,95,110,101,119,32,38,32,40,67,82,78,68,95,77,73,78,95,65,76,76,79,67,95,65,76,73,71,78,77,69,78,84,32,45,32,49,41,41,32,61,61,32,48,0,99,114,110,100,95,114,101,97,108,108,111,99,58,32,98,97,100,32,112,116,114,0,99,114,110,100,95,102,114,101,101,58,32,98,97,100,32,112,116,114,0,102,97,108,115,101,0,40,116,111,116,97,108,95,115,121,109,115,32,62,61,32,49,41,32,38,38,32,40,116,111,116,97,108,95,115,121,109,115,32,60,61,32,112,114,101,102,105,120,95,99,111,100,105,110,103,58,58,99,77,97,120,83,117,112,112,111,114,116,101,100,83,121,109,115,41,0,17,18,19,20,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15,16,48,0,110,117,109,95,98,105,116,115,32,60,61,32,51,50,85,0,109,95,98,105,116,95,99,111,117,110,116,32,60,61,32,99,66,105,116,66,117,102,83,105,122,101,0,116,32,33,61,32,99,85,73,78,84,51,50,95,77,65,88,0,109,111,100,101,108,46,109,95,99,111,100,101,95,115,105,122,101,115,91,115,121,109,93,32,61,61,32,108,101,110,0,0,2,3,1,0,2,3,4,5,6,7,1,40,108,101,110,32,62,61,32,49,41,32,38,38,32,40,108,101,110,32,60,61,32,99,77,97,120,69,120,112,101,99,116,101,100,67,111,100,101,83,105,122,101,41,0,105,32,60,32,109,95,115,105,122,101,0,110,101,120,116,95,108,101,118,101,108,95,111,102,115,32,62,32,99,117,114,95,108,101,118,101,108,95,111,102,115,0,1,2,2,3,3,3,3,4,0,0,0,0,0,0,1,1,0,1,0,1,0,0,1,2,1,2,0,0,0,1,0,2,1,0,2,0,0,1,2,3,110,117,109,32,38,38,32,40,110,117,109,32,61,61,32,126,110,117,109,95,99,104,101,99,107,41,0,83,116,57,101,120,99,101,112,116,105,111,110,0,83,116,57,116,121,112,101,95,105,110,102,111,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,54,95,95,115,104,105,109,95,116,121,112,101,95,105,110,102,111,69,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,57,95,95,112,111,105,110,116,101,114,95,116,121,112,101,95,105,110,102,111,69,0,78,49,48,95,95,99,120,120,97,98,105,118,49,49,55,95,95,112,98,97,115,101,95,116,121,112,101,95,105,110,102,111,69,0,78,49,48,95,95,99,120,120,97,98,105,118,49,50,48,95,95,115,105,95,99,108,97,115,115,95,116,121,112,101,95,105,110,102,111,69,0,112,116,104,114,101,97,100,95,111,110,99,101,32,102,97,105,108,117,114,101,32,105,110,32,95,95,99,120,97,95,103,101,116,95,103,108,111,98,97,108,115,95,102,97,115,116,40,41,0,116,101,114,109,105,110,97,116,101,95,104,97,110,100,108,101,114,32,117,110,101,120,112,101,99,116,101,100,108,121,32,114,101,116,117,114,110,101,100,0,99,97,110,110,111,116,32,99,114,101,97,116,101,32,112,116,104,114,101,97,100,32,107,101,121,32,102,111,114,32,95,95,99,120,97,95,103,101,116,95,103,108,111,98,97,108,115,40,41,0,99,97,110,110,111,116,32,122,101,114,111,32,111,117,116,32,116,104,114,101,97,100,32,118,97,108,117,101,32,102,111,114,32,95,95,99,120,97,95,103,101,116,95,103,108,111,98,97,108,115,40,41,0,116,101,114,109,105,110,97,116,105,110,103,32,119,105,116,104,32,37,115,32,101,120,99,101,112,116,105,111,110,32,111,102,32,116,121,112,101,32,37,115,58,32,37,115,0,116,101,114,109,105,110,97,116,105,110,103,32,119,105,116,104,32,37,115,32,101,120,99,101,112,116,105,111,110,32,111,102,32,116,121,112,101,32,37,115,0,116,101,114,109,105,110,97,116,105,110,103,32,119,105,116,104,32,37,115,32,102,111,114,101,105,103,110,32,101,120,99,101,112,116,105,111,110,0,116,101,114,109,105,110,97,116,105,110,103,0,117,110,99,97,117,103,104,116,0,84,33,34,25,13,1,2,3,17,75,28,12,16,4,11,29,18,30,39,104,110,111,112,113,98,32,5,6,15,19,20,21,26,8,22,7,40,36,23,24,9,10,14,27,31,37,35,131,130,125,38,42,43,60,61,62,63,67,71,74,77,88,89,90,91,92,93,94,95,96,97,99,100,101,102,103,105,106,107,108,114,115,116,121,122,123,124,0,73,108,108,101,103,97,108,32,98,121,116,101,32,115,101,113,117,101,110,99,101,0,68,111,109,97,105,110,32,101,114,114,111,114,0,82,101,115,117,108,116,32,110,111,116,32,114,101,112,114,101,115,101,110,116,97,98,108,101,0,78,111,116,32,97,32,116,116,121,0,80,101,114,109,105,115,115,105,111,110,32,100,101,110,105,101,100,0,79,112,101,114,97,116,105,111,110,32,110,111,116,32,112,101,114,109,105,116,116,101,100,0,78,111,32,115,117,99,104,32,102,105,108,101,32,111,114,32,100,105,114,101,99,116,111,114,121,0,78,111,32,115,117,99,104,32,112,114,111,99,101,115,115,0,70,105,108,101,32,101,120,105,115,116,115,0,86,97,108,117,101,32,116,111,111,32,108,97,114,103,101,32,102,111,114,32,100,97,116,97,32,116,121,112,101,0,78,111,32,115,112,97,99,101,32,108,101,102,116,32,111,110,32,100,101,118,105,99,101,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,82,101,115,111,117,114,99,101,32,98,117,115,121,0,73,110,116,101,114,114,117,112,116,101,100,32,115,121,115,116,101,109,32,99,97,108,108,0,82,101,115,111,117,114,99,101,32,116,101,109,112,111,114,97,114,105,108,121,32,117,110,97,118,97,105,108,97,98,108,101,0,73,110,118,97,108,105,100,32,115,101,101,107,0,67,114,111,115,115,45,100,101,118,105,99,101,32,108,105,110,107,0,82,101,97,100,45,111,110,108,121,32,102,105,108,101,32,115,121,115,116,101,109,0,68,105,114,101,99,116,111,114,121,32,110,111,116,32,101,109,112,116,121,0,67,111,110,110,101,99,116,105,111,110,32,114,101,115,101,116,32,98,121,32,112,101,101,114,0,79,112,101,114,97,116,105,111,110,32,116,105,109,101,100,32,111,117,116,0,67,111,110,110,101,99,116,105,111,110,32,114,101,102,117,115,101,100,0,72,111,115,116,32,105,115,32,100,111,119,110,0,72,111,115,116,32,105,115,32,117,110,114,101,97,99,104,97,98,108,101,0,65,100,100,114,101,115,115,32,105,110,32,117,115,101,0,66,114,111,107,101,110,32,112,105,112,101,0,73,47,79,32,101,114,114,111,114,0,78,111,32,115,117,99,104,32,100,101,118,105,99,101,32,111,114,32,97,100,100,114,101,115,115,0,66,108,111,99,107,32,100,101,118,105,99,101,32,114,101,113,117,105,114,101,100,0,78,111,32,115,117,99,104,32,100,101,118,105,99,101,0,78,111,116,32,97,32,100,105,114,101,99,116,111,114,121,0,73,115,32,97,32,100,105,114,101,99,116,111,114,121,0,84,101,120,116,32,102,105,108,101,32,98,117,115,121,0,69,120,101,99,32,102,111,114,109,97,116,32,101,114,114,111,114,0,73,110,118,97,108,105,100,32,97,114,103,117,109,101,110,116,0,65,114,103,117,109,101,110,116,32,108,105,115,116,32,116,111,111,32,108,111,110,103,0,83,121,109,98,111,108,105,99,32,108,105,110,107,32,108,111,111,112,0,70,105,108,101,110,97,109,101,32,116,111,111,32,108,111,110,103,0,84,111,111,32,109,97,110,121,32,111,112,101,110,32,102,105,108,101,115,32,105,110,32,115,121,115,116,101,109,0,78,111,32,102,105,108,101,32,100,101,115,99,114,105,112,116,111,114,115,32,97,118,97,105,108,97,98,108,101,0,66,97,100,32,102,105,108,101,32,100,101,115,99,114,105,112,116,111,114,0,78,111,32,99,104,105,108,100,32,112,114,111,99,101,115,115,0,66,97,100,32,97,100,100,114,101,115,115,0,70,105,108,101,32,116,111,111,32,108,97,114,103,101,0,84,111,111,32,109,97,110,121,32,108,105,110,107,115,0,78,111,32,108,111,99,107,115,32,97,118,97,105,108,97,98,108,101,0,82,101,115,111,117,114,99,101,32,100,101,97,100,108,111,99,107,32,119,111,117,108,100,32,111,99,99,117,114,0,83,116,97,116,101,32,110,111,116,32,114,101,99,111,118,101,114,97,98,108,101,0,80,114,101,118,105,111,117,115,32,111,119,110,101,114,32,100,105,101,100,0,79,112,101,114,97,116,105,111,110,32,99,97,110,99,101,108,101,100,0,70,117,110,99,116,105,111,110,32,110,111,116,32,105,109,112,108,101,109,101,110,116,101,100,0,78,111,32,109,101,115,115,97,103,101,32,111,102,32,100,101,115,105,114,101,100,32,116,121,112,101,0,73,100,101,110,116,105,102,105,101,114,32,114,101,109,111,118,101,100,0,68,101,118,105,99,101,32,110,111,116,32,97,32,115,116,114,101,97,109,0,78,111,32,100,97,116,97,32,97,118,97,105,108,97,98,108,101,0,68,101,118,105,99,101,32,116,105,109,101,111,117,116,0,79,117,116,32,111,102,32,115,116,114,101,97,109,115,32,114,101,115,111,117,114,99,101,115,0,76,105,110,107,32,104,97,115,32,98,101,101,110,32,115,101,118,101,114,101,100,0,80,114,111,116,111,99,111,108,32,101,114,114,111,114,0,66,97,100,32,109,101,115,115,97,103,101,0,70,105,108,101,32,100,101,115,99,114,105,112,116,111,114,32,105,110,32,98,97,100,32,115,116,97,116,101,0,78,111,116,32,97,32,115,111,99,107,101,116,0,68,101,115,116,105,110,97,116,105,111,110,32,97,100,100,114,101,115,115,32,114,101,113,117,105,114,101,100,0,77,101,115,115,97,103,101,32,116,111,111,32,108,97,114,103,101,0,80,114,111,116,111,99,111,108,32,119,114,111,110,103,32,116,121,112,101,32,102,111,114,32,115,111,99,107,101,116,0,80,114,111,116,111,99,111,108,32,110,111,116,32,97,118,97,105,108,97,98,108,101,0,80,114,111,116,111,99,111,108,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,83,111,99,107,101,116,32,116,121,112,101,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,78,111,116,32,115,117,112,112,111,114,116,101,100,0,80,114,111,116,111,99,111,108,32,102,97,109,105,108,121,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,65,100,100,114,101,115,115,32,102,97,109,105,108,121,32,110,111,116,32,115,117,112,112,111,114,116,101,100,32,98,121,32,112,114,111,116,111,99,111,108,0,65,100,100,114,101,115,115,32,110,111,116,32,97,118,97,105,108,97,98,108,101,0,78,101,116,119,111,114,107,32,105,115,32,100,111,119,110,0,78,101,116,119,111,114,107,32,117,110,114,101,97,99,104,97,98,108,101,0,67,111,110,110,101,99,116,105,111,110,32,114,101,115,101,116,32,98,121,32,110,101,116,119,111,114,107,0,67,111,110,110,101,99,116,105,111,110,32,97,98,111,114,116,101,100,0,78,111,32,98,117,102,102,101,114,32,115,112,97,99,101,32,97,118,97,105,108,97,98,108,101,0,83,111,99,107,101,116,32,105,115,32,99,111,110,110,101,99,116,101,100,0,83,111,99,107,101,116,32,110,111,116,32,99,111,110,110,101,99,116,101,100,0,67,97,110,110,111,116,32,115,101,110,100,32,97,102,116,101,114,32,115,111,99,107,101,116,32,115,104,117,116,100,111,119,110,0,79,112,101,114,97,116,105,111,110,32,97,108,114,101,97,100,121,32,105,110,32,112,114,111,103,114,101,115,115,0,79,112,101,114,97,116,105,111,110,32,105,110,32,112,114,111,103,114,101,115,115,0,83,116,97,108,101,32,102,105,108,101,32,104,97,110,100,108,101,0,82,101,109,111,116,101,32,73,47,79,32,101,114,114,111,114,0,81,117,111,116,97,32,101,120,99,101,101,100,101,100,0,78,111,32,109,101,100,105,117,109,32,102,111,117,110,100,0,87,114,111,110,103,32,109,101,100,105,117,109,32,116,121,112,101,0,78,111,32,101,114,114,111,114,32,105,110,102,111,114,109,97,116,105,111,110,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,10,0,17,17,17,0,0,0,0,5,0,0,0,0,0,0,9,0,0,0,0,11,0,0,0,0,0,0,0,0,17,0,15,10,17,17,17,3,10,7,0,1,19,9,11,11,0,0,9,6,11,0,0,11,0,6,17,0,0,0,17,17,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,17,0,10,10,17,17,17,0,10,0,0,2,0,9,11,0,0,0,9,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,12,0,0,0,0,9,12,0,0,0,0,0,12,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,4,13,0,0,0,0,9,14,0,0,0,0,0,14,0,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,15,0,0,0,0,9,16,0,0,0,0,0,16,0,0,16,0,0,18,0,0,0,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,0,0,0,18,18,18,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,10,0,0,0,0,9,11,0,0,0,0,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,12,0,0,0,0,9,12,0,0,0,0,0,12,0,0,12,0,0,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,45,43,32,32,32,48,88,48,120,0,40,110,117,108,108,41,0,45,48,88,43,48,88,32,48,88,45,48,120,43,48,120,32,48,120,0,105,110,102,0,73,78,70,0,110,97,110,0,78,65,78,0,46,0],"i8",ALLOC_NONE,Runtime.GLOBAL_BASE);var tempDoublePtr=Runtime.alignMemory(allocate(12,"i8",ALLOC_STATIC),8);assert(tempDoublePtr%8==0);function copyTempFloat(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3]}function copyTempDouble(ptr){HEAP8[tempDoublePtr]=HEAP8[ptr];HEAP8[tempDoublePtr+1]=HEAP8[ptr+1];HEAP8[tempDoublePtr+2]=HEAP8[ptr+2];HEAP8[tempDoublePtr+3]=HEAP8[ptr+3];HEAP8[tempDoublePtr+4]=HEAP8[ptr+4];HEAP8[tempDoublePtr+5]=HEAP8[ptr+5];HEAP8[tempDoublePtr+6]=HEAP8[ptr+6];HEAP8[tempDoublePtr+7]=HEAP8[ptr+7]}var _BDtoIHigh=true;Module["_i64Subtract"]=_i64Subtract;Module["_i64Add"]=_i64Add;function _pthread_cleanup_push(routine,arg){__ATEXIT__.push((function(){Runtime.dynCall("vi",routine,[arg])}));_pthread_cleanup_push.level=__ATEXIT__.length}Module["_memset"]=_memset;var _BDtoILow=true;Module["_bitshift64Lshr"]=_bitshift64Lshr;Module["_bitshift64Shl"]=_bitshift64Shl;function _pthread_cleanup_pop(){assert(_pthread_cleanup_push.level==__ATEXIT__.length,"cannot pop if something else added meanwhile!");__ATEXIT__.pop();_pthread_cleanup_push.level=__ATEXIT__.length}function _abort(){Module["abort"]()}function __ZSt18uncaught_exceptionv(){return!!__ZSt18uncaught_exceptionv.uncaught_exception}var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:(function(adjusted){if(!adjusted||EXCEPTIONS.infos[adjusted])return adjusted;for(var ptr in EXCEPTIONS.infos){var info=EXCEPTIONS.infos[ptr];if(info.adjusted===adjusted){return ptr}}return adjusted}),addRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount++}),decRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];assert(info.refcount>0);info.refcount--;if(info.refcount===0){if(info.destructor){Runtime.dynCall("vi",info.destructor,[ptr])}delete EXCEPTIONS.infos[ptr];___cxa_free_exception(ptr)}}),clearRef:(function(ptr){if(!ptr)return;var info=EXCEPTIONS.infos[ptr];info.refcount=0})};function ___cxa_begin_catch(ptr){__ZSt18uncaught_exceptionv.uncaught_exception--;EXCEPTIONS.caught.push(ptr);EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));return ptr}function _pthread_once(ptr,func){if(!_pthread_once.seen)_pthread_once.seen={};if(ptr in _pthread_once.seen)return;Runtime.dynCall("v",func);_pthread_once.seen[ptr]=1}function _emscripten_memcpy_big(dest,src,num){HEAPU8.set(HEAPU8.subarray(src,src+num),dest);return dest}Module["_memcpy"]=_memcpy;var SYSCALLS={varargs:0,get:(function(varargs){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret}),getStr:(function(){var ret=Pointer_stringify(SYSCALLS.get());return ret}),get64:(function(){var low=SYSCALLS.get(),high=SYSCALLS.get();if(low>=0)assert(high===0);else assert(high===-1);return low}),getZero:(function(){assert(SYSCALLS.get()===0)})};function ___syscall6(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var PTHREAD_SPECIFIC={};function _pthread_getspecific(key){return PTHREAD_SPECIFIC[key]||0}function ___setErrNo(value){if(Module["___errno_location"])HEAP32[Module["___errno_location"]()>>2]=value;return value}var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function _sysconf(name){switch(name){case 30:return PAGE_SIZE;case 85:return totalMemory/PAGE_SIZE;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 79:return 0;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}___setErrNo(ERRNO_CODES.EINVAL);return-1}function _sbrk(bytes){var self=_sbrk;if(!self.called){DYNAMICTOP=alignMemoryPage(DYNAMICTOP);self.called=true;assert(Runtime.dynamicAlloc);self.alloc=Runtime.dynamicAlloc;Runtime.dynamicAlloc=(function(){abort("cannot dynamically allocate, sbrk now has control")})}var ret=DYNAMICTOP;if(bytes!=0){var success=self.alloc(bytes);if(!success)return-1>>>0}return ret}var PTHREAD_SPECIFIC_NEXT_KEY=1;function _pthread_key_create(key,destructor){if(key==0){return ERRNO_CODES.EINVAL}HEAP32[key>>2]=PTHREAD_SPECIFIC_NEXT_KEY;PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY]=0;PTHREAD_SPECIFIC_NEXT_KEY++;return 0}var _BItoD=true;var PATH=undefined;function _emscripten_set_main_loop_timing(mode,value){Browser.mainLoop.timingMode=mode;Browser.mainLoop.timingValue=value;if(!Browser.mainLoop.func){return 1}if(mode==0){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setTimeout(){setTimeout(Browser.mainLoop.runner,value)};Browser.mainLoop.method="timeout"}else if(mode==1){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_rAF(){Browser.requestAnimationFrame(Browser.mainLoop.runner)};Browser.mainLoop.method="rAF"}else if(mode==2){if(!window["setImmediate"]){var setImmediates=[];var emscriptenMainLoopMessageId="__emcc";function Browser_setImmediate_messageHandler(event){if(event.source===window&&event.data===emscriptenMainLoopMessageId){event.stopPropagation();setImmediates.shift()()}}window.addEventListener("message",Browser_setImmediate_messageHandler,true);window["setImmediate"]=function Browser_emulated_setImmediate(func){setImmediates.push(func);window.postMessage(emscriptenMainLoopMessageId,"*")}}Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setImmediate(){window["setImmediate"](Browser.mainLoop.runner)};Browser.mainLoop.method="immediate"}return 0}function _emscripten_set_main_loop(func,fps,simulateInfiniteLoop,arg,noSetTiming){Module["noExitRuntime"]=true;assert(!Browser.mainLoop.func,"emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");Browser.mainLoop.func=func;Browser.mainLoop.arg=arg;var thisMainLoopId=Browser.mainLoop.currentlyRunningMainloop;Browser.mainLoop.runner=function Browser_mainLoop_runner(){if(ABORT)return;if(Browser.mainLoop.queue.length>0){var start=Date.now();var blocker=Browser.mainLoop.queue.shift();blocker.func(blocker.arg);if(Browser.mainLoop.remainingBlockers){var remaining=Browser.mainLoop.remainingBlockers;var next=remaining%1==0?remaining-1:Math.floor(remaining);if(blocker.counted){Browser.mainLoop.remainingBlockers=next}else{next=next+.5;Browser.mainLoop.remainingBlockers=(8*remaining+next)/9}}console.log('main loop blocker "'+blocker.name+'" took '+(Date.now()-start)+" ms");Browser.mainLoop.updateStatus();setTimeout(Browser.mainLoop.runner,0);return}if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;Browser.mainLoop.currentFrameNumber=Browser.mainLoop.currentFrameNumber+1|0;if(Browser.mainLoop.timingMode==1&&Browser.mainLoop.timingValue>1&&Browser.mainLoop.currentFrameNumber%Browser.mainLoop.timingValue!=0){Browser.mainLoop.scheduler();return}if(Browser.mainLoop.method==="timeout"&&Module.ctx){Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");Browser.mainLoop.method=""}Browser.mainLoop.runIter((function(){if(typeof arg!=="undefined"){Runtime.dynCall("vi",func,[arg])}else{Runtime.dynCall("v",func)}}));if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop)return;if(typeof SDL==="object"&&SDL.audio&&SDL.audio.queueNewAudioData)SDL.audio.queueNewAudioData();Browser.mainLoop.scheduler()};if(!noSetTiming){if(fps&&fps>0)_emscripten_set_main_loop_timing(0,1e3/fps);else _emscripten_set_main_loop_timing(1,1);Browser.mainLoop.scheduler()}if(simulateInfiniteLoop){throw"SimulateInfiniteLoop"}}var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:(function(){Browser.mainLoop.scheduler=null;Browser.mainLoop.currentlyRunningMainloop++}),resume:(function(){Browser.mainLoop.currentlyRunningMainloop++;var timingMode=Browser.mainLoop.timingMode;var timingValue=Browser.mainLoop.timingValue;var func=Browser.mainLoop.func;Browser.mainLoop.func=null;_emscripten_set_main_loop(func,0,false,Browser.mainLoop.arg,true);_emscripten_set_main_loop_timing(timingMode,timingValue);Browser.mainLoop.scheduler()}),updateStatus:(function(){if(Module["setStatus"]){var message=Module["statusMessage"]||"Please wait...";var remaining=Browser.mainLoop.remainingBlockers;var expected=Browser.mainLoop.expectedBlockers;if(remaining){if(remaining<expected){Module["setStatus"](message+" ("+(expected-remaining)+"/"+expected+")")}else{Module["setStatus"](message)}}else{Module["setStatus"]("")}}}),runIter:(function(func){if(ABORT)return;if(Module["preMainLoop"]){var preRet=Module["preMainLoop"]();if(preRet===false){return}}try{func()}catch(e){if(e instanceof ExitStatus){return}else{if(e&&typeof e==="object"&&e.stack)Module.printErr("exception thrown: "+[e,e.stack]);throw e}}if(Module["postMainLoop"])Module["postMainLoop"]()})},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:(function(){if(!Module["preloadPlugins"])Module["preloadPlugins"]=[];if(Browser.initted)return;Browser.initted=true;try{new Blob;Browser.hasBlobConstructor=true}catch(e){Browser.hasBlobConstructor=false;console.log("warning: no blob constructor, cannot create blobs with mimetypes")}Browser.BlobBuilder=typeof MozBlobBuilder!="undefined"?MozBlobBuilder:typeof WebKitBlobBuilder!="undefined"?WebKitBlobBuilder:!Browser.hasBlobConstructor?console.log("warning: no BlobBuilder"):null;Browser.URLObject=typeof window!="undefined"?window.URL?window.URL:window.webkitURL:undefined;if(!Module.noImageDecoding&&typeof Browser.URLObject==="undefined"){console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");Module.noImageDecoding=true}var imagePlugin={};imagePlugin["canHandle"]=function imagePlugin_canHandle(name){return!Module.noImageDecoding&&/\.(jpg|jpeg|png|bmp)$/i.test(name)};imagePlugin["handle"]=function imagePlugin_handle(byteArray,name,onload,onerror){var b=null;if(Browser.hasBlobConstructor){try{b=new Blob([byteArray],{type:Browser.getMimetype(name)});if(b.size!==byteArray.length){b=new Blob([(new Uint8Array(byteArray)).buffer],{type:Browser.getMimetype(name)})}}catch(e){Runtime.warnOnce("Blob constructor present but fails: "+e+"; falling back to blob builder")}}if(!b){var bb=new Browser.BlobBuilder;bb.append((new Uint8Array(byteArray)).buffer);b=bb.getBlob()}var url=Browser.URLObject.createObjectURL(b);var img=new Image;img.onload=function img_onload(){assert(img.complete,"Image "+name+" could not be decoded");var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);Module["preloadedImages"][name]=canvas;Browser.URLObject.revokeObjectURL(url);if(onload)onload(byteArray)};img.onerror=function img_onerror(event){console.log("Image "+url+" could not be decoded");if(onerror)onerror()};img.src=url};Module["preloadPlugins"].push(imagePlugin);var audioPlugin={};audioPlugin["canHandle"]=function audioPlugin_canHandle(name){return!Module.noAudioDecoding&&name.substr(-4)in{".ogg":1,".wav":1,".mp3":1}};audioPlugin["handle"]=function audioPlugin_handle(byteArray,name,onload,onerror){var done=false;function finish(audio){if(done)return;done=true;Module["preloadedAudios"][name]=audio;if(onload)onload(byteArray)}function fail(){if(done)return;done=true;Module["preloadedAudios"][name]=new Audio;if(onerror)onerror()}if(Browser.hasBlobConstructor){try{var b=new Blob([byteArray],{type:Browser.getMimetype(name)})}catch(e){return fail()}var url=Browser.URLObject.createObjectURL(b);var audio=new Audio;audio.addEventListener("canplaythrough",(function(){finish(audio)}),false);audio.onerror=function audio_onerror(event){if(done)return;console.log("warning: browser could not fully decode audio "+name+", trying slower base64 approach");function encode64(data){var BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var PAD="=";var ret="";var leftchar=0;var leftbits=0;for(var i=0;i<data.length;i++){leftchar=leftchar<<8|data[i];leftbits+=8;while(leftbits>=6){var curr=leftchar>>leftbits-6&63;leftbits-=6;ret+=BASE[curr]}}if(leftbits==2){ret+=BASE[(leftchar&3)<<4];ret+=PAD+PAD}else if(leftbits==4){ret+=BASE[(leftchar&15)<<2];ret+=PAD}return ret}audio.src="data:audio/x-"+name.substr(-3)+";base64,"+encode64(byteArray);finish(audio)};audio.src=url;Browser.safeSetTimeout((function(){finish(audio)}),1e4)}else{return fail()}};Module["preloadPlugins"].push(audioPlugin);var canvas=Module["canvas"];function pointerLockChange(){Browser.pointerLock=document["pointerLockElement"]===canvas||document["mozPointerLockElement"]===canvas||document["webkitPointerLockElement"]===canvas||document["msPointerLockElement"]===canvas}if(canvas){canvas.requestPointerLock=canvas["requestPointerLock"]||canvas["mozRequestPointerLock"]||canvas["webkitRequestPointerLock"]||canvas["msRequestPointerLock"]||(function(){});canvas.exitPointerLock=document["exitPointerLock"]||document["mozExitPointerLock"]||document["webkitExitPointerLock"]||document["msExitPointerLock"]||(function(){});canvas.exitPointerLock=canvas.exitPointerLock.bind(document);document.addEventListener("pointerlockchange",pointerLockChange,false);document.addEventListener("mozpointerlockchange",pointerLockChange,false);document.addEventListener("webkitpointerlockchange",pointerLockChange,false);document.addEventListener("mspointerlockchange",pointerLockChange,false);if(Module["elementPointerLock"]){canvas.addEventListener("click",(function(ev){if(!Browser.pointerLock&&canvas.requestPointerLock){canvas.requestPointerLock();ev.preventDefault()}}),false)}}}),createContext:(function(canvas,useWebGL,setInModule,webGLContextAttributes){if(useWebGL&&Module.ctx&&canvas==Module.canvas)return Module.ctx;var ctx;var contextHandle;if(useWebGL){var contextAttributes={antialias:false,alpha:false};if(webGLContextAttributes){for(var attribute in webGLContextAttributes){contextAttributes[attribute]=webGLContextAttributes[attribute]}}contextHandle=GL.createContext(canvas,contextAttributes);if(contextHandle){ctx=GL.getContext(contextHandle).GLctx}canvas.style.backgroundColor="black"}else{ctx=canvas.getContext("2d")}if(!ctx)return null;if(setInModule){if(!useWebGL)assert(typeof GLctx==="undefined","cannot set in module if GLctx is used, but we are a non-GL context that would replace it");Module.ctx=ctx;if(useWebGL)GL.makeContextCurrent(contextHandle);Module.useWebGL=useWebGL;Browser.moduleContextCreatedCallbacks.forEach((function(callback){callback()}));Browser.init()}return ctx}),destroyContext:(function(canvas,useWebGL,setInModule){}),fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:(function(lockPointer,resizeCanvas,vrDevice){Browser.lockPointer=lockPointer;Browser.resizeCanvas=resizeCanvas;Browser.vrDevice=vrDevice;if(typeof Browser.lockPointer==="undefined")Browser.lockPointer=true;if(typeof Browser.resizeCanvas==="undefined")Browser.resizeCanvas=false;if(typeof Browser.vrDevice==="undefined")Browser.vrDevice=null;var canvas=Module["canvas"];function fullScreenChange(){Browser.isFullScreen=false;var canvasContainer=canvas.parentNode;if((document["webkitFullScreenElement"]||document["webkitFullscreenElement"]||document["mozFullScreenElement"]||document["mozFullscreenElement"]||document["fullScreenElement"]||document["fullscreenElement"]||document["msFullScreenElement"]||document["msFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvasContainer){canvas.cancelFullScreen=document["cancelFullScreen"]||document["mozCancelFullScreen"]||document["webkitCancelFullScreen"]||document["msExitFullscreen"]||document["exitFullscreen"]||(function(){});canvas.cancelFullScreen=canvas.cancelFullScreen.bind(document);if(Browser.lockPointer)canvas.requestPointerLock();Browser.isFullScreen=true;if(Browser.resizeCanvas)Browser.setFullScreenCanvasSize()}else{canvasContainer.parentNode.insertBefore(canvas,canvasContainer);canvasContainer.parentNode.removeChild(canvasContainer);if(Browser.resizeCanvas)Browser.setWindowedCanvasSize()}if(Module["onFullScreen"])Module["onFullScreen"](Browser.isFullScreen);Browser.updateCanvasDimensions(canvas)}if(!Browser.fullScreenHandlersInstalled){Browser.fullScreenHandlersInstalled=true;document.addEventListener("fullscreenchange",fullScreenChange,false);document.addEventListener("mozfullscreenchange",fullScreenChange,false);document.addEventListener("webkitfullscreenchange",fullScreenChange,false);document.addEventListener("MSFullscreenChange",fullScreenChange,false)}var canvasContainer=document.createElement("div");canvas.parentNode.insertBefore(canvasContainer,canvas);canvasContainer.appendChild(canvas);canvasContainer.requestFullScreen=canvasContainer["requestFullScreen"]||canvasContainer["mozRequestFullScreen"]||canvasContainer["msRequestFullscreen"]||(canvasContainer["webkitRequestFullScreen"]?(function(){canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])}):null);if(vrDevice){canvasContainer.requestFullScreen({vrDisplay:vrDevice})}else{canvasContainer.requestFullScreen()}}),nextRAF:0,fakeRequestAnimationFrame:(function(func){var now=Date.now();if(Browser.nextRAF===0){Browser.nextRAF=now+1e3/60}else{while(now+2>=Browser.nextRAF){Browser.nextRAF+=1e3/60}}var delay=Math.max(Browser.nextRAF-now,0);setTimeout(func,delay)}),requestAnimationFrame:function requestAnimationFrame(func){if(typeof window==="undefined"){Browser.fakeRequestAnimationFrame(func)}else{if(!window.requestAnimationFrame){window.requestAnimationFrame=window["requestAnimationFrame"]||window["mozRequestAnimationFrame"]||window["webkitRequestAnimationFrame"]||window["msRequestAnimationFrame"]||window["oRequestAnimationFrame"]||Browser.fakeRequestAnimationFrame}window.requestAnimationFrame(func)}},safeCallback:(function(func){return(function(){if(!ABORT)return func.apply(null,arguments)})}),allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:(function(){Browser.allowAsyncCallbacks=false}),resumeAsyncCallbacks:(function(){Browser.allowAsyncCallbacks=true;if(Browser.queuedAsyncCallbacks.length>0){var callbacks=Browser.queuedAsyncCallbacks;Browser.queuedAsyncCallbacks=[];callbacks.forEach((function(func){func()}))}}),safeRequestAnimationFrame:(function(func){return Browser.requestAnimationFrame((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}else{Browser.queuedAsyncCallbacks.push(func)}}))}),safeSetTimeout:(function(func,timeout){Module["noExitRuntime"]=true;return setTimeout((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}else{Browser.queuedAsyncCallbacks.push(func)}}),timeout)}),safeSetInterval:(function(func,timeout){Module["noExitRuntime"]=true;return setInterval((function(){if(ABORT)return;if(Browser.allowAsyncCallbacks){func()}}),timeout)}),getMimetype:(function(name){return{"jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","bmp":"image/bmp","ogg":"audio/ogg","wav":"audio/wav","mp3":"audio/mpeg"}[name.substr(name.lastIndexOf(".")+1)]}),getUserMedia:(function(func){if(!window.getUserMedia){window.getUserMedia=navigator["getUserMedia"]||navigator["mozGetUserMedia"]}window.getUserMedia(func)}),getMovementX:(function(event){return event["movementX"]||event["mozMovementX"]||event["webkitMovementX"]||0}),getMovementY:(function(event){return event["movementY"]||event["mozMovementY"]||event["webkitMovementY"]||0}),getMouseWheelDelta:(function(event){var delta=0;switch(event.type){case"DOMMouseScroll":delta=event.detail;break;case"mousewheel":delta=event.wheelDelta;break;case"wheel":delta=event["deltaY"];break;default:throw"unrecognized mouse wheel event: "+event.type}return delta}),mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:(function(event){if(Browser.pointerLock){if(event.type!="mousemove"&&"mozMovementX"in event){Browser.mouseMovementX=Browser.mouseMovementY=0}else{Browser.mouseMovementX=Browser.getMovementX(event);Browser.mouseMovementY=Browser.getMovementY(event)}if(typeof SDL!="undefined"){Browser.mouseX=SDL.mouseX+Browser.mouseMovementX;Browser.mouseY=SDL.mouseY+Browser.mouseMovementY}else{Browser.mouseX+=Browser.mouseMovementX;Browser.mouseY+=Browser.mouseMovementY}}else{var rect=Module["canvas"].getBoundingClientRect();var cw=Module["canvas"].width;var ch=Module["canvas"].height;var scrollX=typeof window.scrollX!=="undefined"?window.scrollX:window.pageXOffset;var scrollY=typeof window.scrollY!=="undefined"?window.scrollY:window.pageYOffset;if(event.type==="touchstart"||event.type==="touchend"||event.type==="touchmove"){var touch=event.touch;if(touch===undefined){return}var adjustedX=touch.pageX-(scrollX+rect.left);var adjustedY=touch.pageY-(scrollY+rect.top);adjustedX=adjustedX*(cw/rect.width);adjustedY=adjustedY*(ch/rect.height);var coords={x:adjustedX,y:adjustedY};if(event.type==="touchstart"){Browser.lastTouches[touch.identifier]=coords;Browser.touches[touch.identifier]=coords}else if(event.type==="touchend"||event.type==="touchmove"){var last=Browser.touches[touch.identifier];if(!last)last=coords;Browser.lastTouches[touch.identifier]=last;Browser.touches[touch.identifier]=coords}return}var x=event.pageX-(scrollX+rect.left);var y=event.pageY-(scrollY+rect.top);x=x*(cw/rect.width);y=y*(ch/rect.height);Browser.mouseMovementX=x-Browser.mouseX;Browser.mouseMovementY=y-Browser.mouseY;Browser.mouseX=x;Browser.mouseY=y}}),xhrLoad:(function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function xhr_onload(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response)}else{onerror()}};xhr.onerror=onerror;xhr.send(null)}),asyncLoad:(function(url,onload,onerror,noRunDep){Browser.xhrLoad(url,(function(arrayBuffer){assert(arrayBuffer,'Loading data file "'+url+'" failed (no arrayBuffer).');onload(new Uint8Array(arrayBuffer));if(!noRunDep)removeRunDependency("al "+url)}),(function(event){if(onerror){onerror()}else{throw'Loading data file "'+url+'" failed.'}}));if(!noRunDep)addRunDependency("al "+url)}),resizeListeners:[],updateResizeListeners:(function(){var canvas=Module["canvas"];Browser.resizeListeners.forEach((function(listener){listener(canvas.width,canvas.height)}))}),setCanvasSize:(function(width,height,noUpdates){var canvas=Module["canvas"];Browser.updateCanvasDimensions(canvas,width,height);if(!noUpdates)Browser.updateResizeListeners()}),windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:(function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2];flags=flags|8388608;HEAP32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2]=flags}Browser.updateResizeListeners()}),setWindowedCanvasSize:(function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2];flags=flags&~8388608;HEAP32[SDL.screen+Runtime.QUANTUM_SIZE*0>>2]=flags}Browser.updateResizeListeners()}),updateCanvasDimensions:(function(canvas,wNative,hNative){if(wNative&&hNative){canvas.widthNative=wNative;canvas.heightNative=hNative}else{wNative=canvas.widthNative;hNative=canvas.heightNative}var w=wNative;var h=hNative;if(Module["forcedAspectRatio"]&&Module["forcedAspectRatio"]>0){if(w/h<Module["forcedAspectRatio"]){w=Math.round(h*Module["forcedAspectRatio"])}else{h=Math.round(w/Module["forcedAspectRatio"])}}if((document["webkitFullScreenElement"]||document["webkitFullscreenElement"]||document["mozFullScreenElement"]||document["mozFullscreenElement"]||document["fullScreenElement"]||document["fullscreenElement"]||document["msFullScreenElement"]||document["msFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvas.parentNode&&typeof screen!="undefined"){var factor=Math.min(screen.width/w,screen.height/h);w=Math.round(w*factor);h=Math.round(h*factor)}if(Browser.resizeCanvas){if(canvas.width!=w)canvas.width=w;if(canvas.height!=h)canvas.height=h;if(typeof canvas.style!="undefined"){canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}else{if(canvas.width!=wNative)canvas.width=wNative;if(canvas.height!=hNative)canvas.height=hNative;if(typeof canvas.style!="undefined"){if(w!=wNative||h!=hNative){canvas.style.setProperty("width",w+"px","important");canvas.style.setProperty("height",h+"px","important")}else{canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}}}),wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:(function(){var handle=Browser.nextWgetRequestHandle;Browser.nextWgetRequestHandle++;return handle})};function _pthread_setspecific(key,value){if(!(key in PTHREAD_SPECIFIC)){return ERRNO_CODES.EINVAL}PTHREAD_SPECIFIC[key]=value;return 0}function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}function _pthread_self(){return 0}function ___syscall140(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_high=SYSCALLS.get(),offset_low=SYSCALLS.get(),result=SYSCALLS.get(),whence=SYSCALLS.get();var offset=offset_low;assert(offset_high===0);FS.llseek(stream,offset,whence);HEAP32[result>>2]=stream.position;if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall146(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get();var ret=0;if(!___syscall146.buffer)___syscall146.buffer=[];var buffer=___syscall146.buffer;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){var curr=HEAPU8[ptr+j];if(curr===0||curr===10){Module["print"](UTF8ArrayToString(buffer,0));buffer.length=0}else{buffer.push(curr)}}ret+=len}return ret}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall54(which,varargs){SYSCALLS.varargs=varargs;try{return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}Module["requestFullScreen"]=function Module_requestFullScreen(lockPointer,resizeCanvas,vrDevice){Browser.requestFullScreen(lockPointer,resizeCanvas,vrDevice)};Module["requestAnimationFrame"]=function Module_requestAnimationFrame(func){Browser.requestAnimationFrame(func)};Module["setCanvasSize"]=function Module_setCanvasSize(width,height,noUpdates){Browser.setCanvasSize(width,height,noUpdates)};Module["pauseMainLoop"]=function Module_pauseMainLoop(){Browser.mainLoop.pause()};Module["resumeMainLoop"]=function Module_resumeMainLoop(){Browser.mainLoop.resume()};Module["getUserMedia"]=function Module_getUserMedia(){Browser.getUserMedia()};Module["createContext"]=function Module_createContext(canvas,useWebGL,setInModule,webGLContextAttributes){return Browser.createContext(canvas,useWebGL,setInModule,webGLContextAttributes)};STACK_BASE=STACKTOP=Runtime.alignMemory(STATICTOP);staticSealed=true;STACK_MAX=STACK_BASE+TOTAL_STACK;DYNAMIC_BASE=DYNAMICTOP=Runtime.alignMemory(STACK_MAX);assert(DYNAMIC_BASE<TOTAL_MEMORY,"TOTAL_MEMORY not big enough for stack");var cttz_i8=allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0],"i8",ALLOC_DYNAMIC);function invoke_iiii(index,a1,a2,a3){try{return Module["dynCall_iiii"](index,a1,a2,a3)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viiiii(index,a1,a2,a3,a4,a5){try{Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_vi(index,a1){try{Module["dynCall_vi"](index,a1)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_ii(index,a1){try{return Module["dynCall_ii"](index,a1)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viii(index,a1,a2,a3){try{Module["dynCall_viii"](index,a1,a2,a3)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_v(index){try{Module["dynCall_v"](index)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){try{Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}function invoke_viiii(index,a1,a2,a3,a4){try{Module["dynCall_viiii"](index,a1,a2,a3,a4)}catch(e){if(typeof e!=="number"&&e!=="longjmp")throw e;asm["setThrew"](1,0)}}Module.asmGlobalArg={"Math":Math,"Int8Array":Int8Array,"Int16Array":Int16Array,"Int32Array":Int32Array,"Uint8Array":Uint8Array,"Uint16Array":Uint16Array,"Uint32Array":Uint32Array,"Float32Array":Float32Array,"Float64Array":Float64Array,"NaN":NaN,"Infinity":Infinity,"byteLength":byteLength};Module.asmLibraryArg={"abort":abort,"assert":assert,"invoke_iiii":invoke_iiii,"invoke_viiiii":invoke_viiiii,"invoke_vi":invoke_vi,"invoke_ii":invoke_ii,"invoke_viii":invoke_viii,"invoke_v":invoke_v,"invoke_viiiiii":invoke_viiiiii,"invoke_viiii":invoke_viiii,"_pthread_cleanup_pop":_pthread_cleanup_pop,"_pthread_getspecific":_pthread_getspecific,"_pthread_setspecific":_pthread_setspecific,"__ZSt18uncaught_exceptionv":__ZSt18uncaught_exceptionv,"_emscripten_set_main_loop":_emscripten_set_main_loop,"_pthread_self":_pthread_self,"_abort":_abort,"_pthread_cleanup_push":_pthread_cleanup_push,"___syscall6":___syscall6,"_sbrk":_sbrk,"_time":_time,"_pthread_key_create":_pthread_key_create,"___setErrNo":___setErrNo,"_emscripten_memcpy_big":_emscripten_memcpy_big,"___syscall54":___syscall54,"___syscall140":___syscall140,"_pthread_once":_pthread_once,"_emscripten_set_main_loop_timing":_emscripten_set_main_loop_timing,"_sysconf":_sysconf,"___syscall146":___syscall146,"___cxa_begin_catch":___cxa_begin_catch,"STACKTOP":STACKTOP,"STACK_MAX":STACK_MAX,"tempDoublePtr":tempDoublePtr,"ABORT":ABORT,"cttz_i8":cttz_i8};// EMSCRIPTEN_START_ASM
    var asm=(function(global,env,buffer) {
        "use asm";var a=global.Int8Array;var b=global.Int16Array;var c=global.Int32Array;var d=global.Uint8Array;var e=global.Uint16Array;var f=global.Uint32Array;var g=global.Float32Array;var h=global.Float64Array;var i=new a(buffer);var j=new b(buffer);var k=new c(buffer);var l=new d(buffer);var m=new e(buffer);var n=new f(buffer);var o=new g(buffer);var p=new h(buffer);var q=global.byteLength;var r=env.STACKTOP|0;var s=env.STACK_MAX|0;var t=env.tempDoublePtr|0;var u=env.ABORT|0;var v=env.cttz_i8|0;var w=0;var x=0;var y=0;var z=0;var A=global.NaN,B=global.Infinity;var C=0,D=0,E=0,F=0,G=0.0,H=0,I=0,J=0,K=0.0;var L=0;var M=0;var N=0;var O=0;var P=0;var Q=0;var R=0;var S=0;var T=0;var U=0;var V=global.Math.floor;var W=global.Math.abs;var X=global.Math.sqrt;var Y=global.Math.pow;var Z=global.Math.cos;var _=global.Math.sin;var $=global.Math.tan;var aa=global.Math.acos;var ba=global.Math.asin;var ca=global.Math.atan;var da=global.Math.atan2;var ea=global.Math.exp;var fa=global.Math.log;var ga=global.Math.ceil;var ha=global.Math.imul;var ia=global.Math.min;var ja=global.Math.clz32;var ka=env.abort;var la=env.assert;var ma=env.invoke_iiii;var na=env.invoke_viiiii;var oa=env.invoke_vi;var pa=env.invoke_ii;var qa=env.invoke_viii;var ra=env.invoke_v;var sa=env.invoke_viiiiii;var ta=env.invoke_viiii;var ua=env._pthread_cleanup_pop;var va=env._pthread_getspecific;var wa=env._pthread_setspecific;var xa=env.__ZSt18uncaught_exceptionv;var ya=env._emscripten_set_main_loop;var za=env._pthread_self;var Aa=env._abort;var Ba=env._pthread_cleanup_push;var Ca=env.___syscall6;var Da=env._sbrk;var Ea=env._time;var Fa=env._pthread_key_create;var Ga=env.___setErrNo;var Ha=env._emscripten_memcpy_big;var Ia=env.___syscall54;var Ja=env.___syscall140;var Ka=env._pthread_once;var La=env._emscripten_set_main_loop_timing;var Ma=env._sysconf;var Na=env.___syscall146;var Oa=env.___cxa_begin_catch;var Pa=0.0;function Qa(newBuffer){if(q(newBuffer)&16777215||q(newBuffer)<=16777215||q(newBuffer)>2147483648)return false;i=new a(newBuffer);j=new b(newBuffer);k=new c(newBuffer);l=new d(newBuffer);m=new e(newBuffer);n=new f(newBuffer);o=new g(newBuffer);p=new h(newBuffer);buffer=newBuffer;return true}
// EMSCRIPTEN_START_FUNCS
        function Za(a){a=a|0;var b=0;b=r;r=r+a|0;r=r+15&-16;return b|0}function _a(){return r|0}function $a(a){a=a|0;r=a}function ab(a,b){a=a|0;b=b|0;r=a;s=b}function bb(a,b){a=a|0;b=b|0;if(!w){w=a;x=b}}function cb(a){a=a|0;i[t>>0]=i[a>>0];i[t+1>>0]=i[a+1>>0];i[t+2>>0]=i[a+2>>0];i[t+3>>0]=i[a+3>>0]}function db(a){a=a|0;i[t>>0]=i[a>>0];i[t+1>>0]=i[a+1>>0];i[t+2>>0]=i[a+2>>0];i[t+3>>0]=i[a+3>>0];i[t+4>>0]=i[a+4>>0];i[t+5>>0]=i[a+5>>0];i[t+6>>0]=i[a+6>>0];i[t+7>>0]=i[a+7>>0]}function eb(a){a=a|0;L=a}function fb(){return L|0}function gb(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0;o=r;r=r+576|0;l=o+48|0;h=o+32|0;g=o+16|0;f=o;j=o+64|0;m=o+60|0;i=a+4|0;n=a+8|0;if((k[i>>2]|0)>>>0>(k[n>>2]|0)>>>0){k[f>>2]=1138;k[f+4>>2]=2119;k[f+8>>2]=1117;yc(j,1084,f)|0;xc(j)|0}if((2147418112/(d>>>0)|0)>>>0<=b>>>0){k[g>>2]=1138;k[g+4>>2]=2120;k[g+8>>2]=1157;yc(j,1084,g)|0;xc(j)|0}g=k[n>>2]|0;if(g>>>0>=b>>>0){n=1;r=o;return n|0}do if(c){if(b){f=b+-1|0;if(!(f&b)){f=11;break}else b=f}else b=-1;b=b>>>16|b;b=b>>>8|b;b=b>>>4|b;b=b>>>2|b;b=(b>>>1|b)+1|0;f=10}else f=10;while(0);if((f|0)==10)if(!b){b=0;f=12}else f=11;if((f|0)==11)if(b>>>0<=g>>>0)f=12;if((f|0)==12){k[h>>2]=1138;k[h+4>>2]=2129;k[h+8>>2]=1205;yc(j,1084,h)|0;xc(j)|0}c=ha(b,d)|0;do if(!e){f=hb(k[a>>2]|0,c,m,1)|0;if(!f){n=0;r=o;return n|0}else{k[a>>2]=f;break}}else{g=ib(c,m)|0;if(!g){n=0;r=o;return n|0}Va[e&0](g,k[a>>2]|0,k[i>>2]|0);f=k[a>>2]|0;do if(f)if(!(f&7)){kb(f,0,0,1,0)|0;break}else{k[l>>2]=1138;k[l+4>>2]=2502;k[l+8>>2]=1504;yc(j,1084,l)|0;xc(j)|0;break}while(0);k[a>>2]=g}while(0);f=k[m>>2]|0;if(f>>>0>c>>>0)b=(f>>>0)/(d>>>0)|0;k[n>>2]=b;n=1;r=o;return n|0}function hb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;j=r;r=r+560|0;i=j+32|0;f=j+16|0;e=j;h=j+48|0;g=j+44|0;if(a&7){k[e>>2]=1138;k[e+4>>2]=2502;k[e+8>>2]=1482;yc(h,1084,e)|0;xc(h)|0;i=0;r=j;return i|0}if(b>>>0>2147418112){k[f>>2]=1138;k[f+4>>2]=2502;k[f+8>>2]=1375;yc(h,1084,f)|0;xc(h)|0;i=0;r=j;return i|0}k[g>>2]=b;d=kb(a,b,g,d,0)|0;if(c)k[c>>2]=k[g>>2];if(!(d&7)){i=d;r=j;return i|0}k[i>>2]=1138;k[i+4>>2]=2554;k[i+8>>2]=1428;yc(h,1084,i)|0;xc(h)|0;i=d;r=j;return i|0}function ib(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0;i=r;r=r+560|0;h=i+32|0;g=i+16|0;c=i;f=i+48|0;e=i+44|0;d=a+3&-4;d=(d|0)!=0?d:4;if(d>>>0>2147418112){k[c>>2]=1138;k[c+4>>2]=2502;k[c+8>>2]=1375;yc(f,1084,c)|0;xc(f)|0;h=0;r=i;return h|0}k[e>>2]=d;c=kb(0,d,e,1,0)|0;a=k[e>>2]|0;if(b)k[b>>2]=a;if((c|0)==0|a>>>0<d>>>0){k[g>>2]=1138;k[g+4>>2]=2502;k[g+8>>2]=1401;yc(f,1084,g)|0;xc(f)|0;h=0;r=i;return h|0}if(!(c&7)){h=c;r=i;return h|0}k[h>>2]=1138;k[h+4>>2]=2529;k[h+8>>2]=1428;yc(f,1084,h)|0;xc(f)|0;h=c;r=i;return h|0}function jb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0;L=r;r=r+880|0;I=L+144|0;H=L+128|0;G=L+112|0;F=L+96|0;C=L+80|0;w=L+64|0;u=L+48|0;v=L+32|0;q=L+16|0;p=L;E=L+360|0;J=L+296|0;K=L+224|0;t=L+156|0;if((b|0)==0|d>>>0>11){a=0;r=L;return a|0}k[a>>2]=b;e=K;f=e+68|0;do{k[e>>2]=0;e=e+4|0}while((e|0)<(f|0));f=0;do{e=i[c+f>>0]|0;if(e<<24>>24){D=K+((e&255)<<2)|0;k[D>>2]=(k[D>>2]|0)+1}f=f+1|0}while((f|0)!=(b|0));f=0;o=1;g=0;h=-1;n=0;while(1){e=k[K+(o<<2)>>2]|0;if(!e)k[a+28+(o+-1<<2)>>2]=0;else{D=o+-1|0;k[J+(D<<2)>>2]=f;f=e+f|0;B=16-o|0;k[a+28+(D<<2)>>2]=(f+-1<<B|(1<<B)+-1)+1;k[a+96+(D<<2)>>2]=n;k[t+(o<<2)>>2]=n;g=g>>>0>o>>>0?g:o;h=h>>>0<o>>>0?h:o;n=e+n|0}o=o+1|0;if((o|0)==17){D=g;break}else f=f<<1}k[a+4>>2]=n;f=a+172|0;do if(n>>>0>(k[f>>2]|0)>>>0){k[f>>2]=n;if(n){e=n+-1|0;if(e&n)s=14}else{e=-1;s=14}if((s|0)==14){B=e>>>16|e;B=B>>>8|B;B=B>>>4|B;B=B>>>2|B;B=(B>>>1|B)+1|0;k[f>>2]=B>>>0>b>>>0?b:B}g=a+176|0;e=k[g>>2]|0;do if(e){B=k[e+-4>>2]|0;e=e+-8|0;if(!((B|0)!=0?(B|0)==(~k[e>>2]|0):0)){k[p>>2]=1138;k[p+4>>2]=647;k[p+8>>2]=1851;yc(E,1084,p)|0;xc(E)|0}if(!(e&7)){kb(e,0,0,1,0)|0;break}else{k[q>>2]=1138;k[q+4>>2]=2502;k[q+8>>2]=1504;yc(E,1084,q)|0;xc(E)|0;break}}while(0);f=k[f>>2]|0;f=(f|0)!=0?f:1;e=ib((f<<1)+8|0,0)|0;if(!e){k[g>>2]=0;e=0;break}else{k[e+4>>2]=f;k[e>>2]=~f;k[g>>2]=e+8;s=25;break}}else s=25;while(0);a:do if((s|0)==25){B=a+24|0;i[B>>0]=h;i[a+25>>0]=D;f=a+176|0;g=0;do{A=i[c+g>>0]|0;e=A&255;if(A<<24>>24){if(!(k[K+(e<<2)>>2]|0)){k[v>>2]=1138;k[v+4>>2]=2272;k[v+8>>2]=1249;yc(E,1084,v)|0;xc(E)|0}A=t+(e<<2)|0;e=k[A>>2]|0;k[A>>2]=e+1;if(e>>>0>=n>>>0){k[u>>2]=1138;k[u+4>>2]=2276;k[u+8>>2]=1262;yc(E,1084,u)|0;xc(E)|0}j[(k[f>>2]|0)+(e<<1)>>1]=g}g=g+1|0}while((g|0)!=(b|0));e=i[B>>0]|0;z=(e&255)>>>0<d>>>0?d:0;A=a+8|0;k[A>>2]=z;y=(z|0)!=0;if(y){x=1<<z;e=a+164|0;do if(x>>>0>(k[e>>2]|0)>>>0){k[e>>2]=x;g=a+168|0;e=k[g>>2]|0;do if(e){v=k[e+-4>>2]|0;e=e+-8|0;if(!((v|0)!=0?(v|0)==(~k[e>>2]|0):0)){k[w>>2]=1138;k[w+4>>2]=647;k[w+8>>2]=1851;yc(E,1084,w)|0;xc(E)|0}if(!(e&7)){kb(e,0,0,1,0)|0;break}else{k[C>>2]=1138;k[C+4>>2]=2502;k[C+8>>2]=1504;yc(E,1084,C)|0;xc(E)|0;break}}while(0);e=x<<2;f=ib(e+8|0,0)|0;if(!f){k[g>>2]=0;e=0;break a}else{C=f+8|0;k[f+4>>2]=x;k[f>>2]=~x;k[g>>2]=C;f=C;break}}else{f=a+168|0;e=x<<2;g=f;f=k[f>>2]|0}while(0);$c(f|0,-1,e|0)|0;t=a+176|0;w=1;do{if(k[K+(w<<2)>>2]|0){u=z-w|0;v=1<<u;f=w+-1|0;h=k[J+(f<<2)>>2]|0;if(f>>>0>=16){k[F>>2]=1138;k[F+4>>2]=1956;k[F+8>>2]=1725;yc(E,1084,F)|0;xc(E)|0}e=k[a+28+(f<<2)>>2]|0;if(!e)b=-1;else b=(e+-1|0)>>>(16-w|0);if(h>>>0<=b>>>0){q=(k[a+96+(f<<2)>>2]|0)-h|0;s=w<<16;do{e=m[(k[t>>2]|0)+(q+h<<1)>>1]|0;if((l[c+e>>0]|0|0)!=(w|0)){k[G>>2]=1138;k[G+4>>2]=2318;k[G+8>>2]=1291;yc(E,1084,G)|0;xc(E)|0}p=h<<u;f=e|s;o=0;do{n=o+p|0;if(n>>>0>=x>>>0){k[H>>2]=1138;k[H+4>>2]=2324;k[H+8>>2]=1325;yc(E,1084,H)|0;xc(E)|0}e=k[g>>2]|0;if((k[e+(n<<2)>>2]|0)!=-1){k[I>>2]=1138;k[I+4>>2]=2326;k[I+8>>2]=1348;yc(E,1084,I)|0;xc(E)|0;e=k[g>>2]|0}k[e+(n<<2)>>2]=f;o=o+1|0}while(o>>>0<v>>>0);h=h+1|0}while(h>>>0<=b>>>0)}}w=w+1|0}while(z>>>0>=w>>>0);e=i[B>>0]|0}f=a+96|0;k[f>>2]=(k[f>>2]|0)-(k[J>>2]|0);f=a+100|0;k[f>>2]=(k[f>>2]|0)-(k[J+4>>2]|0);f=a+104|0;k[f>>2]=(k[f>>2]|0)-(k[J+8>>2]|0);f=a+108|0;k[f>>2]=(k[f>>2]|0)-(k[J+12>>2]|0);f=a+112|0;k[f>>2]=(k[f>>2]|0)-(k[J+16>>2]|0);f=a+116|0;k[f>>2]=(k[f>>2]|0)-(k[J+20>>2]|0);f=a+120|0;k[f>>2]=(k[f>>2]|0)-(k[J+24>>2]|0);f=a+124|0;k[f>>2]=(k[f>>2]|0)-(k[J+28>>2]|0);f=a+128|0;k[f>>2]=(k[f>>2]|0)-(k[J+32>>2]|0);f=a+132|0;k[f>>2]=(k[f>>2]|0)-(k[J+36>>2]|0);f=a+136|0;k[f>>2]=(k[f>>2]|0)-(k[J+40>>2]|0);f=a+140|0;k[f>>2]=(k[f>>2]|0)-(k[J+44>>2]|0);f=a+144|0;k[f>>2]=(k[f>>2]|0)-(k[J+48>>2]|0);f=a+148|0;k[f>>2]=(k[f>>2]|0)-(k[J+52>>2]|0);f=a+152|0;k[f>>2]=(k[f>>2]|0)-(k[J+56>>2]|0);f=a+156|0;k[f>>2]=(k[f>>2]|0)-(k[J+60>>2]|0);f=a+16|0;k[f>>2]=0;g=a+20|0;k[g>>2]=e&255;b:do if(y){while(1){if(!d)break b;e=d+-1|0;if(!(k[K+(d<<2)>>2]|0))d=e;else break}k[f>>2]=k[a+28+(e<<2)>>2];e=z+1|0;k[g>>2]=e;if(e>>>0<=D>>>0){while(1){if(k[K+(e<<2)>>2]|0)break;e=e+1|0;if(e>>>0>D>>>0)break b}k[g>>2]=e}}while(0);k[a+92>>2]=-1;k[a+160>>2]=1048575;k[a+12>>2]=32-(k[A>>2]|0);e=1}while(0);a=e;r=L;return a|0}function kb(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;do if(!a){d=Sc(b)|0;if(c){if(!d)a=0;else a=Vc(d)|0;k[c>>2]=a}}else{if(!b){Tc(a);if(!c){d=0;break}k[c>>2]=0;d=0;break}if(d){d=Uc(a,b)|0;a=(d|0)==0?a:d}else d=0;if(c){b=Vc(a)|0;k[c>>2]=b}}while(0);return d|0}function lb(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if(!((a|0)!=0&b>>>0>73&(c|0)!=0)){c=0;return c|0}if((k[c>>2]|0)!=40|b>>>0<74){c=0;return c|0}if(((l[a>>0]|0)<<8|(l[a+1>>0]|0)|0)!=18552){c=0;return c|0}if(((l[a+2>>0]|0)<<8|(l[a+3>>0]|0))>>>0<74){c=0;return c|0}if(((l[a+7>>0]|0)<<16|(l[a+6>>0]|0)<<24|(l[a+8>>0]|0)<<8|(l[a+9>>0]|0))>>>0>b>>>0){c=0;return c|0}k[c+4>>2]=(l[a+12>>0]|0)<<8|(l[a+13>>0]|0);k[c+8>>2]=(l[a+14>>0]|0)<<8|(l[a+15>>0]|0);k[c+12>>2]=l[a+16>>0];k[c+16>>2]=l[a+17>>0];b=a+18|0;d=c+32|0;k[d>>2]=l[b>>0];k[d+4>>2]=0;b=i[b>>0]|0;k[c+20>>2]=b<<24>>24==0|b<<24>>24==9?8:16;k[c+24>>2]=(l[a+26>>0]|0)<<16|(l[a+25>>0]|0)<<24|(l[a+27>>0]|0)<<8|(l[a+28>>0]|0);k[c+28>>2]=(l[a+30>>0]|0)<<16|(l[a+29>>0]|0)<<24|(l[a+31>>0]|0)<<8|(l[a+32>>0]|0);c=1;return c|0}function mb(a){a=a|0;Oa(a|0)|0;Sb()}function nb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;f=r;r=r+528|0;e=f;d=f+16|0;b=k[a+20>>2]|0;if(b)ob(b);b=a+4|0;c=k[b>>2]|0;if(!c){e=a+16|0;i[e>>0]=0;r=f;return}if(!(c&7))kb(c,0,0,1,0)|0;else{k[e>>2]=1138;k[e+4>>2]=2502;k[e+8>>2]=1504;yc(d,1084,e)|0;xc(d)|0}k[b>>2]=0;k[a+8>>2]=0;k[a+12>>2]=0;e=a+16|0;i[e>>0]=0;r=f;return}function ob(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;i=r;r=r+592|0;g=i+64|0;f=i+48|0;h=i+32|0;d=i+16|0;c=i;e=i+80|0;if(!a){r=i;return}b=k[a+168>>2]|0;do if(b){j=k[b+-4>>2]|0;b=b+-8|0;if(!((j|0)!=0?(j|0)==(~k[b>>2]|0):0)){k[c>>2]=1138;k[c+4>>2]=647;k[c+8>>2]=1851;yc(e,1084,c)|0;xc(e)|0}if(!(b&7)){kb(b,0,0,1,0)|0;break}else{k[d>>2]=1138;k[d+4>>2]=2502;k[d+8>>2]=1504;yc(e,1084,d)|0;xc(e)|0;break}}while(0);b=k[a+176>>2]|0;do if(b){j=k[b+-4>>2]|0;b=b+-8|0;if(!((j|0)!=0?(j|0)==(~k[b>>2]|0):0)){k[h>>2]=1138;k[h+4>>2]=647;k[h+8>>2]=1851;yc(e,1084,h)|0;xc(e)|0}if(!(b&7)){kb(b,0,0,1,0)|0;break}else{k[f>>2]=1138;k[f+4>>2]=2502;k[f+8>>2]=1504;yc(e,1084,f)|0;xc(e)|0;break}}while(0);if(!(a&7)){kb(a,0,0,1,0)|0;r=i;return}else{k[g>>2]=1138;k[g+4>>2]=2502;k[g+8>>2]=1504;yc(e,1084,g)|0;xc(e)|0;r=i;return}}function pb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0;i=r;r=r+544|0;g=i+16|0;b=i;f=i+32|0;e=a+8|0;c=k[e>>2]|0;if((c+-1|0)>>>0>=8192){k[b>>2]=1138;k[b+4>>2]=3002;k[b+8>>2]=1529;yc(f,1084,b)|0;xc(f)|0}k[a>>2]=c;d=a+20|0;b=k[d>>2]|0;if(!b){b=ib(180,0)|0;if(!b)b=0;else{h=b+164|0;k[h>>2]=0;k[h+4>>2]=0;k[h+8>>2]=0;k[h+12>>2]=0}k[d>>2]=b;h=k[a>>2]|0}else h=c;if(!(k[e>>2]|0)){k[g>>2]=1138;k[g+4>>2]=906;k[g+8>>2]=1769;yc(f,1084,g)|0;xc(f)|0;g=k[a>>2]|0}else g=h;f=k[a+4>>2]|0;if(g>>>0>16){d=g;c=0}else{a=0;a=jb(b,h,f,a)|0;r=i;return a|0}while(1){e=c+1|0;if(d>>>0>3){d=d>>>1;c=e}else{d=e;break}}a=c+2+((d|0)!=32&1<<d>>>0<g>>>0&1)|0;a=a>>>0<11?a&255:11;a=jb(b,h,f,a)|0;r=i;return a|0}function qb(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,j=0,m=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;E=r;r=r+720|0;z=E+160|0;y=E+144|0;x=E+128|0;w=E+112|0;v=E+96|0;u=E+80|0;t=E+64|0;s=E+48|0;n=E+32|0;h=E+16|0;e=E;C=E+200|0;D=E+176|0;A=rb(a,14)|0;if(!A){k[b>>2]=0;c=b+4|0;d=k[c>>2]|0;if(d){if(!(d&7))kb(d,0,0,1,0)|0;else{k[e>>2]=1138;k[e+4>>2]=2502;k[e+8>>2]=1504;yc(C,1084,e)|0;xc(C)|0}k[c>>2]=0;k[b+8>>2]=0;k[b+12>>2]=0}i[b+16>>0]=0;c=b+20|0;d=k[c>>2]|0;if(!d){b=1;r=E;return b|0}ob(d);k[c>>2]=0;b=1;r=E;return b|0}p=b+4|0;q=b+8|0;c=k[q>>2]|0;if((c|0)!=(A|0)){if(c>>>0<=A>>>0){do if((k[b+12>>2]|0)>>>0<A>>>0){if(gb(p,A,(c+1|0)==(A|0),1,0)|0){c=k[q>>2]|0;break}i[b+16>>0]=1;b=0;r=E;return b|0}while(0);$c((k[p>>2]|0)+c|0,0,A-c|0)|0}k[q>>2]=A}$c(k[p>>2]|0,0,A|0)|0;o=a+20|0;c=k[o>>2]|0;if((c|0)<5){f=a+4|0;g=a+8|0;e=a+16|0;do{d=k[f>>2]|0;if((d|0)==(k[g>>2]|0))d=0;else{k[f>>2]=d+1;d=l[d>>0]|0}c=c+8|0;k[o>>2]=c;if((c|0)>=33){k[h>>2]=1138;k[h+4>>2]=3204;k[h+8>>2]=1638;yc(C,1084,h)|0;xc(C)|0;c=k[o>>2]|0}d=d<<32-c|k[e>>2];k[e>>2]=d}while((c|0)<5)}else{d=a+16|0;e=d;d=k[d>>2]|0}m=d>>>27;k[e>>2]=d<<5;k[o>>2]=c+-5;if((m+-1|0)>>>0>20){b=0;r=E;return b|0}k[D+20>>2]=0;k[D>>2]=0;k[D+4>>2]=0;k[D+8>>2]=0;k[D+12>>2]=0;i[D+16>>0]=0;c=D+4|0;d=D+8|0;a:do if(gb(c,21,0,1,0)|0){h=k[d>>2]|0;j=k[c>>2]|0;$c(j+h|0,0,21-h|0)|0;k[d>>2]=21;if(m){e=a+4|0;f=a+8|0;g=a+16|0;h=0;do{c=k[o>>2]|0;if((c|0)<3)do{d=k[e>>2]|0;if((d|0)==(k[f>>2]|0))d=0;else{k[e>>2]=d+1;d=l[d>>0]|0}c=c+8|0;k[o>>2]=c;if((c|0)>=33){k[n>>2]=1138;k[n+4>>2]=3204;k[n+8>>2]=1638;yc(C,1084,n)|0;xc(C)|0;c=k[o>>2]|0}d=d<<32-c|k[g>>2];k[g>>2]=d}while((c|0)<3);else d=k[g>>2]|0;k[g>>2]=d<<3;k[o>>2]=c+-3;i[j+(l[1599+h>>0]|0)>>0]=d>>>29;h=h+1|0}while((h|0)!=(m|0))}if(pb(D)|0){m=a+4|0;h=a+8|0;j=a+16|0;d=0;b:while(1){g=A-d|0;c=sb(a,D)|0;c:do if(c>>>0<17){if((k[q>>2]|0)>>>0<=d>>>0){k[s>>2]=1138;k[s+4>>2]=906;k[s+8>>2]=1769;yc(C,1084,s)|0;xc(C)|0}i[(k[p>>2]|0)+d>>0]=c;c=d+1|0}else switch(c|0){case 17:{c=k[o>>2]|0;if((c|0)<3)do{e=k[m>>2]|0;if((e|0)==(k[h>>2]|0))e=0;else{k[m>>2]=e+1;e=l[e>>0]|0}c=c+8|0;k[o>>2]=c;if((c|0)>=33){k[t>>2]=1138;k[t+4>>2]=3204;k[t+8>>2]=1638;yc(C,1084,t)|0;xc(C)|0;c=k[o>>2]|0}e=e<<32-c|k[j>>2];k[j>>2]=e}while((c|0)<3);else e=k[j>>2]|0;k[j>>2]=e<<3;k[o>>2]=c+-3;c=(e>>>29)+3|0;if(c>>>0>g>>>0){c=0;break a}c=c+d|0;break c}case 18:{c=k[o>>2]|0;if((c|0)<7)do{e=k[m>>2]|0;if((e|0)==(k[h>>2]|0))e=0;else{k[m>>2]=e+1;e=l[e>>0]|0}c=c+8|0;k[o>>2]=c;if((c|0)>=33){k[u>>2]=1138;k[u+4>>2]=3204;k[u+8>>2]=1638;yc(C,1084,u)|0;xc(C)|0;c=k[o>>2]|0}e=e<<32-c|k[j>>2];k[j>>2]=e}while((c|0)<7);else e=k[j>>2]|0;k[j>>2]=e<<7;k[o>>2]=c+-7;c=(e>>>25)+11|0;if(c>>>0>g>>>0){c=0;break a}c=c+d|0;break c}default:{if((c+-19|0)>>>0>=2){B=90;break b}f=k[o>>2]|0;if((c|0)==19){if((f|0)<2){e=f;while(1){c=k[m>>2]|0;if((c|0)==(k[h>>2]|0))f=0;else{k[m>>2]=c+1;f=l[c>>0]|0}c=e+8|0;k[o>>2]=c;if((c|0)>=33){k[v>>2]=1138;k[v+4>>2]=3204;k[v+8>>2]=1638;yc(C,1084,v)|0;xc(C)|0;c=k[o>>2]|0}e=f<<32-c|k[j>>2];k[j>>2]=e;if((c|0)<2)e=c;else break}}else{e=k[j>>2]|0;c=f}k[j>>2]=e<<2;k[o>>2]=c+-2;f=(e>>>30)+3|0}else{if((f|0)<6){e=f;while(1){c=k[m>>2]|0;if((c|0)==(k[h>>2]|0))f=0;else{k[m>>2]=c+1;f=l[c>>0]|0}c=e+8|0;k[o>>2]=c;if((c|0)>=33){k[w>>2]=1138;k[w+4>>2]=3204;k[w+8>>2]=1638;yc(C,1084,w)|0;xc(C)|0;c=k[o>>2]|0}e=f<<32-c|k[j>>2];k[j>>2]=e;if((c|0)<6)e=c;else break}}else{e=k[j>>2]|0;c=f}k[j>>2]=e<<6;k[o>>2]=c+-6;f=(e>>>26)+7|0}if((d|0)==0|f>>>0>g>>>0){c=0;break a}c=d+-1|0;if((k[q>>2]|0)>>>0<=c>>>0){k[x>>2]=1138;k[x+4>>2]=906;k[x+8>>2]=1769;yc(C,1084,x)|0;xc(C)|0}e=i[(k[p>>2]|0)+c>>0]|0;if(!(e<<24>>24)){c=0;break a}c=f+d|0;if(d>>>0>=c>>>0){c=d;break c}do{if((k[q>>2]|0)>>>0<=d>>>0){k[y>>2]=1138;k[y+4>>2]=906;k[y+8>>2]=1769;yc(C,1084,y)|0;xc(C)|0}i[(k[p>>2]|0)+d>>0]=e;d=d+1|0}while((d|0)!=(c|0))}}while(0);if(A>>>0>c>>>0)d=c;else break}if((B|0)==90){k[z>>2]=1138;k[z+4>>2]=3145;k[z+8>>2]=1620;yc(C,1084,z)|0;xc(C)|0;c=0;break}if((A|0)==(c|0))c=pb(b)|0;else c=0}else c=0}else{i[D+16>>0]=1;c=0}while(0);nb(D);b=c;r=E;return b|0}function rb(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;j=r;r=r+528|0;g=j;f=j+16|0;if(!b){i=0;r=j;return i|0}if(b>>>0<=16){i=tb(a,b)|0;r=j;return i|0}h=tb(a,b+-16|0)|0;i=a+20|0;b=k[i>>2]|0;if((b|0)<16){d=a+4|0;e=a+8|0;c=a+16|0;do{a=k[d>>2]|0;if((a|0)==(k[e>>2]|0))a=0;else{k[d>>2]=a+1;a=l[a>>0]|0}b=b+8|0;k[i>>2]=b;if((b|0)>=33){k[g>>2]=1138;k[g+4>>2]=3204;k[g+8>>2]=1638;yc(f,1084,g)|0;xc(f)|0;b=k[i>>2]|0}a=a<<32-b|k[c>>2];k[c>>2]=a}while((b|0)<16)}else{a=a+16|0;c=a;a=k[a>>2]|0}k[c>>2]=a<<16;k[i>>2]=b+-16;i=a>>>16|h<<16;r=j;return i|0}function sb(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,n=0,o=0,p=0,q=0,s=0,t=0;t=r;r=r+576|0;o=t+48|0;n=t+32|0;j=t+16|0;i=t;q=t+64|0;p=k[b+20>>2]|0;s=a+20|0;h=k[s>>2]|0;do if((h|0)<24){g=a+4|0;d=k[g>>2]|0;e=k[a+8>>2]|0;c=d>>>0<e>>>0;if((h|0)>=16){if(c){k[g>>2]=d+1;c=l[d>>0]|0}else c=0;k[s>>2]=h+8;g=a+16|0;f=c<<24-h|k[g>>2];k[g>>2]=f;break}if(c){f=(l[d>>0]|0)<<8;c=d+1|0}else{f=0;c=d}if(c>>>0<e>>>0){d=l[c>>0]|0;c=c+1|0}else d=0;k[g>>2]=c;k[s>>2]=h+16;g=a+16|0;f=(d|f)<<16-h|k[g>>2];k[g>>2]=f}else{f=a+16|0;g=f;f=k[f>>2]|0}while(0);e=(f>>>16)+1|0;do if(e>>>0<=(k[p+16>>2]|0)>>>0){d=k[(k[p+168>>2]|0)+(f>>>(32-(k[p+8>>2]|0)|0)<<2)>>2]|0;if((d|0)==-1){k[i>>2]=1138;k[i+4>>2]=3249;k[i+8>>2]=1665;yc(q,1084,i)|0;xc(q)|0}c=d&65535;d=d>>>16;if((k[b+8>>2]|0)>>>0<=c>>>0){k[j>>2]=1138;k[j+4>>2]=905;k[j+8>>2]=1769;yc(q,1084,j)|0;xc(q)|0}if((l[(k[b+4>>2]|0)+c>>0]|0|0)!=(d|0)){k[n>>2]=1138;k[n+4>>2]=3253;k[n+8>>2]=1682;yc(q,1084,n)|0;xc(q)|0}}else{d=k[p+20>>2]|0;while(1){c=d+-1|0;if(e>>>0>(k[p+28+(c<<2)>>2]|0)>>>0)d=d+1|0;else break}c=(f>>>(32-d|0))+(k[p+96+(c<<2)>>2]|0)|0;if(c>>>0<(k[b>>2]|0)>>>0){c=m[(k[p+176>>2]|0)+(c<<1)>>1]|0;break}k[o>>2]=1138;k[o+4>>2]=3271;k[o+8>>2]=1620;yc(q,1084,o)|0;xc(q)|0;s=0;r=t;return s|0}while(0);k[g>>2]=k[g>>2]<<d;k[s>>2]=(k[s>>2]|0)-d;s=c;r=t;return s|0}function tb(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;j=r;r=r+544|0;h=j+16|0;c=j;g=j+32|0;if(b>>>0>=33){k[c>>2]=1138;k[c+4>>2]=3195;k[c+8>>2]=1622;yc(g,1084,c)|0;xc(g)|0}i=a+20|0;c=k[i>>2]|0;if((c|0)>=(b|0)){e=a+16|0;f=e;e=k[e>>2]|0;g=c;h=32-b|0;h=e>>>h;e=e<<b;k[f>>2]=e;b=g-b|0;k[i>>2]=b;r=j;return h|0}e=a+4|0;f=a+8|0;d=a+16|0;do{a=k[e>>2]|0;if((a|0)==(k[f>>2]|0))a=0;else{k[e>>2]=a+1;a=l[a>>0]|0}c=c+8|0;k[i>>2]=c;if((c|0)>=33){k[h>>2]=1138;k[h+4>>2]=3204;k[h+8>>2]=1638;yc(g,1084,h)|0;xc(g)|0;c=k[i>>2]|0}a=a<<32-c|k[d>>2];k[d>>2]=a}while((c|0)<(b|0));h=32-b|0;h=a>>>h;g=a<<b;k[d>>2]=g;b=c-b|0;k[i>>2]=b;r=j;return h|0}function ub(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,j=0,m=0,n=0,o=0,p=0,q=0,s=0,t=0;q=r;r=r+528|0;o=q;n=q+16|0;if((a|0)==0|b>>>0<62){p=0;r=q;return p|0}m=ib(300,0)|0;if(!m){p=0;r=q;return p|0}k[m>>2]=519686845;c=m+4|0;k[c>>2]=0;d=m+8|0;k[d>>2]=0;j=m+88|0;e=m+136|0;f=m+160|0;g=j;h=g+44|0;do{k[g>>2]=0;g=g+4|0}while((g|0)<(h|0));i[j+44>>0]=0;s=m+184|0;g=m+208|0;h=m+232|0;t=m+252|0;k[t>>2]=0;k[t+4>>2]=0;k[t+8>>2]=0;i[t+12>>0]=0;t=m+268|0;k[t>>2]=0;k[t+4>>2]=0;k[t+8>>2]=0;i[t+12>>0]=0;t=m+284|0;k[t>>2]=0;k[t+4>>2]=0;k[t+8>>2]=0;i[t+12>>0]=0;k[e>>2]=0;k[e+4>>2]=0;k[e+8>>2]=0;k[e+12>>2]=0;k[e+16>>2]=0;i[e+20>>0]=0;k[f>>2]=0;k[f+4>>2]=0;k[f+8>>2]=0;k[f+12>>2]=0;k[f+16>>2]=0;i[f+20>>0]=0;k[s>>2]=0;k[s+4>>2]=0;k[s+8>>2]=0;k[s+12>>2]=0;k[s+16>>2]=0;i[s+20>>0]=0;k[g>>2]=0;k[g+4>>2]=0;k[g+8>>2]=0;k[g+12>>2]=0;k[g+16>>2]=0;i[g+20>>0]=0;k[h>>2]=0;k[h+4>>2]=0;k[h+8>>2]=0;k[h+12>>2]=0;i[h+16>>0]=0;do if(((b>>>0>=74?((l[a>>0]|0)<<8|(l[a+1>>0]|0)|0)==18552:0)?((l[a+2>>0]|0)<<8|(l[a+3>>0]|0))>>>0>=74:0)?((l[a+7>>0]|0)<<16|(l[a+6>>0]|0)<<24|(l[a+8>>0]|0)<<8|(l[a+9>>0]|0))>>>0<=b>>>0:0){k[j>>2]=a;k[c>>2]=a;k[d>>2]=b;if(Eb(m)|0){c=k[j>>2]|0;if((l[c+39>>0]|0)<<8|(l[c+40>>0]|0)){if(!(Fb(m)|0))break;if(!(Gb(m)|0))break;c=k[j>>2]|0}if(!((l[c+55>>0]|0)<<8|(l[c+56>>0]|0))){t=m;r=q;return t|0}if(Hb(m)|0?Ib(m)|0:0){t=m;r=q;return t|0}}}else p=7;while(0);if((p|0)==7)k[j>>2]=0;Nb(m);if(!(m&7)){kb(m,0,0,1,0)|0;t=0;r=q;return t|0}else{k[o>>2]=1138;k[o+4>>2]=2502;k[o+8>>2]=1504;yc(n,1084,o)|0;xc(n)|0;t=0;r=q;return t|0}return 0}function vb(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,m=0;m=r;r=r+528|0;j=m;i=m+16|0;f=k[a+88>>2]|0;h=(l[f+70+(e<<2)+1>>0]|0)<<16|(l[f+70+(e<<2)>>0]|0)<<24|(l[f+70+(e<<2)+2>>0]|0)<<8|(l[f+70+(e<<2)+3>>0]|0);g=e+1|0;if(g>>>0<(l[f+16>>0]|0)>>>0)f=(l[f+70+(g<<2)+1>>0]|0)<<16|(l[f+70+(g<<2)>>0]|0)<<24|(l[f+70+(g<<2)+2>>0]|0)<<8|(l[f+70+(g<<2)+3>>0]|0);else f=k[a+8>>2]|0;if(f>>>0>h>>>0){i=a+4|0;i=k[i>>2]|0;i=i+h|0;j=f-h|0;j=wb(a,i,j,b,c,d,e)|0;r=m;return j|0}k[j>>2]=1138;k[j+4>>2]=3690;k[j+8>>2]=1780;yc(i,1084,j)|0;xc(i)|0;i=a+4|0;i=k[i>>2]|0;i=i+h|0;j=f-h|0;j=wb(a,i,j,b,c,d,e)|0;r=m;return j|0}function wb(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,m=0,n=0;n=k[a+88>>2]|0;j=((l[n+12>>0]|0)<<8|(l[n+13>>0]|0))>>>g;m=((l[n+14>>0]|0)<<8|(l[n+15>>0]|0))>>>g;j=j>>>0>1?(j+3|0)>>>2:1;m=m>>>0>1?(m+3|0)>>>2:1;n=n+18|0;g=i[n>>0]|0;g=ha(g<<24>>24==0|g<<24>>24==9?8:16,j)|0;if(f)if((f&3|0)==0&g>>>0<=f>>>0)g=f;else{a=0;return a|0}if((ha(g,m)|0)>>>0>e>>>0){a=0;return a|0}f=(j+1|0)>>>1;h=(m+1|0)>>>1;if(!c){a=0;return a|0}k[a+92>>2]=b;k[a+96>>2]=b;k[a+104>>2]=c;k[a+100>>2]=b+c;k[a+108>>2]=0;k[a+112>>2]=0;switch(l[n>>0]|0|0){case 0:{Jb(a,d,e,g,j,m,f,h)|0;a=1;return a|0}case 4:case 6:case 5:case 3:case 2:{Kb(a,d,e,g,j,m,f,h)|0;a=1;return a|0}case 9:{Lb(a,d,e,g,j,m,f,h)|0;a=1;return a|0}case 8:case 7:{Mb(a,d,e,g,j,m,f,h)|0;a=1;return a|0}default:{a=0;return a|0}}return 0}function xb(a,b){a=a|0;b=b|0;var c=0,d=0;d=r;r=r+48|0;c=d;k[c>>2]=40;lb(a,b,c)|0;r=d;return k[c+4>>2]|0}function yb(a,b){a=a|0;b=b|0;var c=0,d=0;d=r;r=r+48|0;c=d;k[c>>2]=40;lb(a,b,c)|0;r=d;return k[c+8>>2]|0}function zb(a,b){a=a|0;b=b|0;var c=0,d=0;d=r;r=r+48|0;c=d;k[c>>2]=40;lb(a,b,c)|0;r=d;return k[c+12>>2]|0}function Ab(a,b){a=a|0;b=b|0;var c=0,d=0;d=r;r=r+48|0;c=d;k[c>>2]=40;lb(a,b,c)|0;r=d;return k[c+32>>2]|0}function Bb(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;e=r;r=r+576|0;d=e+40|0;c=e+56|0;f=e;k[f>>2]=40;lb(a,b,f)|0;b=f+32|0;a=k[b+4>>2]|0;do switch(k[b>>2]|0){case 0:{if(!a){f=8;r=e;return f|0}else a=14;break}case 1:{if(!a)a=13;else a=14;break}case 2:{if(!a)a=13;else a=14;break}case 3:{if(!a)a=13;else a=14;break}case 4:{if(!a)a=13;else a=14;break}case 5:{if(!a)a=13;else a=14;break}case 6:{if(!a)a=13;else a=14;break}case 7:{if(!a)a=13;else a=14;break}case 8:{if(!a)a=13;else a=14;break}case 9:{if(!a){f=8;r=e;return f|0}else a=14;break}case 10:{if(!a){f=8;r=e;return f|0}else a=14;break}default:a=14}while(0);if((a|0)==13){f=16;r=e;return f|0}else if((a|0)==14){k[d>>2]=1138;k[d+4>>2]=2668;k[d+8>>2]=1523;yc(c,1084,d)|0;xc(c)|0;f=0;r=e;return f|0}return 0}function Cb(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0;h=r;r=r+576|0;f=h+40|0;e=h+56|0;i=h;k[i>>2]=40;lb(a,b,i)|0;d=(((k[i+4>>2]|0)>>>c)+3|0)>>>2;b=(((k[i+8>>2]|0)>>>c)+3|0)>>>2;c=i+32|0;a=k[c+4>>2]|0;do switch(k[c>>2]|0){case 0:{if(!a)a=8;else g=14;break}case 1:{if(!a)g=13;else g=14;break}case 2:{if(!a)g=13;else g=14;break}case 3:{if(!a)g=13;else g=14;break}case 4:{if(!a)g=13;else g=14;break}case 5:{if(!a)g=13;else g=14;break}case 6:{if(!a)g=13;else g=14;break}case 7:{if(!a)g=13;else g=14;break}case 8:{if(!a)g=13;else g=14;break}case 9:{if(!a)a=8;else g=14;break}case 10:{if(!a)a=8;else g=14;break}default:g=14}while(0);if((g|0)==13)a=16;else if((g|0)==14){k[f>>2]=1138;k[f+4>>2]=2668;k[f+8>>2]=1523;yc(e,1084,f)|0;xc(e)|0;a=0}i=ha(ha(b,d)|0,a)|0;r=h;return i|0}function Db(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0;q=r;r=r+592|0;p=q+56|0;g=q+40|0;n=q+72|0;m=q;o=q+68|0;k[m>>2]=40;lb(a,b,m)|0;h=(k[m+4>>2]|0)>>>e;i=(k[m+8>>2]|0)>>>e;m=m+32|0;d=k[m+4>>2]|0;do switch(k[m>>2]|0){case 0:{if(!d)m=8;else j=14;break}case 1:{if(!d)j=13;else j=14;break}case 2:{if(!d)j=13;else j=14;break}case 3:{if(!d)j=13;else j=14;break}case 4:{if(!d)j=13;else j=14;break}case 5:{if(!d)j=13;else j=14;break}case 6:{if(!d)j=13;else j=14;break}case 7:{if(!d)j=13;else j=14;break}case 8:{if(!d)j=13;else j=14;break}case 9:{if(!d)m=8;else j=14;break}case 10:{if(!d)m=8;else j=14;break}default:j=14}while(0);if((j|0)==13)m=16;else if((j|0)==14){k[g>>2]=1138;k[g+4>>2]=2668;k[g+8>>2]=1523;yc(n,1084,g)|0;xc(n)|0;m=0}k[o>>2]=c;l=ub(a,b)|0;b=f+e|0;if(b>>>0>e>>>0){j=(l|0)==0;a=c;while(1){d=ha((h+3|0)>>>2,m)|0;g=ha(d,(i+3|0)>>>2)|0;if(!(e>>>0>15|(j|g>>>0<8))?(k[l>>2]|0)==519686845:0)vb(l,o,g,d,e)|0;a=a+g|0;k[o>>2]=a;e=e+1|0;if((e|0)==(b|0))break;else{i=i>>>1;h=h>>>1}}}if(!l){r=q;return}if((k[l>>2]|0)!=519686845){r=q;return}Nb(l);if(!(l&7)){kb(l,0,0,1,0)|0;r=q;return}else{k[p>>2]=1138;k[p+4>>2]=2502;k[p+8>>2]=1504;yc(n,1084,p)|0;xc(n)|0;r=q;return}}function Eb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;g=a+92|0;d=k[a+4>>2]|0;f=a+88|0;e=k[f>>2]|0;b=(l[e+68>>0]|0)<<8|(l[e+67>>0]|0)<<16|(l[e+69>>0]|0);c=d+b|0;e=(l[e+65>>0]|0)<<8|(l[e+66>>0]|0);if(!e){a=0;return a|0}k[g>>2]=c;k[a+96>>2]=c;k[a+104>>2]=e;k[a+100>>2]=d+(e+b);k[a+108>>2]=0;k[a+112>>2]=0;if(!(qb(g,a+116|0)|0)){a=0;return a|0}b=k[f>>2]|0;do if(!((l[b+39>>0]|0)<<8|(l[b+40>>0]|0))){if(!((l[b+55>>0]|0)<<8|(l[b+56>>0]|0))){a=0;return a|0}}else{if(!(qb(g,a+140|0)|0)){a=0;return a|0}if(qb(g,a+188|0)|0){b=k[f>>2]|0;break}else{a=0;return a|0}}while(0);if((l[b+55>>0]|0)<<8|(l[b+56>>0]|0)){if(!(qb(g,a+164|0)|0)){a=0;return a|0}if(!(qb(g,a+212|0)|0)){a=0;return a|0}}a=1;return a|0}function Fb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,j=0,m=0,n=0,o=0,p=0,q=0;q=r;r=r+576|0;h=q;g=q+64|0;p=q+16|0;d=a+88|0;b=k[d>>2]|0;o=(l[b+39>>0]|0)<<8|(l[b+40>>0]|0);m=a+236|0;f=a+240|0;c=k[f>>2]|0;if((c|0)!=(o|0)){if(c>>>0<=o>>>0){do if((k[a+244>>2]|0)>>>0<o>>>0){if(gb(m,o,(c+1|0)==(o|0),4,0)|0){b=k[f>>2]|0;break}i[a+248>>0]=1;p=0;r=q;return p|0}else b=c;while(0);$c((k[m>>2]|0)+(b<<2)|0,0,o-b<<2|0)|0;b=k[d>>2]|0}k[f>>2]=o}j=a+92|0;c=k[a+4>>2]|0;d=(l[b+34>>0]|0)<<8|(l[b+33>>0]|0)<<16|(l[b+35>>0]|0);e=c+d|0;b=(l[b+37>>0]|0)<<8|(l[b+36>>0]|0)<<16|(l[b+38>>0]|0);if(!b){p=0;r=q;return p|0}k[j>>2]=e;k[a+96>>2]=e;k[a+104>>2]=b;k[a+100>>2]=c+(b+d);k[a+108>>2]=0;k[a+112>>2]=0;k[p+20>>2]=0;k[p>>2]=0;k[p+4>>2]=0;k[p+8>>2]=0;k[p+12>>2]=0;i[p+16>>0]=0;a=p+24|0;k[p+44>>2]=0;k[a>>2]=0;k[a+4>>2]=0;k[a+8>>2]=0;k[a+12>>2]=0;i[a+16>>0]=0;if(qb(j,p)|0?(n=p+24|0,qb(j,n)|0):0){if(!(k[f>>2]|0)){k[h>>2]=1138;k[h+4>>2]=906;k[h+8>>2]=1769;yc(g,1084,h)|0;xc(g)|0}if(!o)b=1;else{d=0;e=0;f=0;b=0;g=0;a=0;h=0;c=k[m>>2]|0;while(1){d=(sb(j,p)|0)+d&31;e=(sb(j,n)|0)+e&63;f=(sb(j,p)|0)+f&31;b=(sb(j,p)|0)+b|0;g=(sb(j,n)|0)+g&63;a=(sb(j,p)|0)+a&31;k[c>>2]=e<<5|d<<11|f|b<<27|g<<21|a<<16;h=h+1|0;if((h|0)==(o|0)){b=1;break}else{b=b&31;c=c+4|0}}}}else b=0;nb(p+24|0);nb(p);p=b;r=q;return p|0}function Gb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,j=0,m=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;D=r;r=r+1008|0;g=D;f=D+496|0;C=D+472|0;A=D+276|0;B=D+80|0;z=D+16|0;e=k[a+88>>2]|0;y=(l[e+47>>0]|0)<<8|(l[e+48>>0]|0);x=a+92|0;b=k[a+4>>2]|0;c=(l[e+42>>0]|0)<<8|(l[e+41>>0]|0)<<16|(l[e+43>>0]|0);d=b+c|0;e=(l[e+45>>0]|0)<<8|(l[e+44>>0]|0)<<16|(l[e+46>>0]|0);if(!e){C=0;r=D;return C|0}k[x>>2]=d;k[a+96>>2]=d;k[a+104>>2]=e;k[a+100>>2]=b+(e+c);k[a+108>>2]=0;k[a+112>>2]=0;k[C+20>>2]=0;k[C>>2]=0;k[C+4>>2]=0;k[C+8>>2]=0;k[C+12>>2]=0;i[C+16>>0]=0;if(qb(x,C)|0){c=0;d=-3;e=-3;while(1){k[A+(c<<2)>>2]=d;k[B+(c<<2)>>2]=e;b=(d|0)>2;c=c+1|0;if((c|0)==49)break;else{d=b?-3:d+1|0;e=(b&1)+e|0}}b=z;c=b+64|0;do{k[b>>2]=0;b=b+4|0}while((b|0)<(c|0));w=a+252|0;c=a+256|0;b=k[c>>2]|0;a:do if((b|0)==(y|0))h=13;else{if(b>>>0<=y>>>0){do if((k[a+260>>2]|0)>>>0<y>>>0)if(gb(w,y,(b+1|0)==(y|0),4,0)|0){b=k[c>>2]|0;break}else{i[a+264>>0]=1;b=0;break a}while(0);$c((k[w>>2]|0)+(b<<2)|0,0,y-b<<2|0)|0}k[c>>2]=y;h=13}while(0);do if((h|0)==13){if(!y){k[g>>2]=1138;k[g+4>>2]=906;k[g+8>>2]=1769;yc(f,1084,g)|0;xc(f)|0;b=1;break}d=z+4|0;e=z+8|0;a=z+12|0;f=z+16|0;g=z+20|0;h=z+24|0;j=z+28|0;m=z+32|0;n=z+36|0;o=z+40|0;p=z+44|0;q=z+48|0;s=z+52|0;t=z+56|0;u=z+60|0;v=0;c=k[w>>2]|0;while(1){b=0;do{E=sb(x,C)|0;w=b<<1;F=z+(w<<2)|0;k[F>>2]=(k[F>>2]|0)+(k[A+(E<<2)>>2]|0)&3;w=z+((w|1)<<2)|0;k[w>>2]=(k[w>>2]|0)+(k[B+(E<<2)>>2]|0)&3;b=b+1|0}while((b|0)!=8);k[c>>2]=(l[1713+(k[d>>2]|0)>>0]|0)<<2|(l[1713+(k[z>>2]|0)>>0]|0)|(l[1713+(k[e>>2]|0)>>0]|0)<<4|(l[1713+(k[a>>2]|0)>>0]|0)<<6|(l[1713+(k[f>>2]|0)>>0]|0)<<8|(l[1713+(k[g>>2]|0)>>0]|0)<<10|(l[1713+(k[h>>2]|0)>>0]|0)<<12|(l[1713+(k[j>>2]|0)>>0]|0)<<14|(l[1713+(k[m>>2]|0)>>0]|0)<<16|(l[1713+(k[n>>2]|0)>>0]|0)<<18|(l[1713+(k[o>>2]|0)>>0]|0)<<20|(l[1713+(k[p>>2]|0)>>0]|0)<<22|(l[1713+(k[q>>2]|0)>>0]|0)<<24|(l[1713+(k[s>>2]|0)>>0]|0)<<26|(l[1713+(k[t>>2]|0)>>0]|0)<<28|(l[1713+(k[u>>2]|0)>>0]|0)<<30;v=v+1|0;if((v|0)==(y|0)){b=1;break}else c=c+4|0}}while(0)}else b=0;nb(C);F=b;r=D;return F|0}function Hb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,m=0,n=0,o=0,p=0;p=r;r=r+560|0;h=p;g=p+40|0;o=p+16|0;e=k[a+88>>2]|0;n=(l[e+55>>0]|0)<<8|(l[e+56>>0]|0);m=a+92|0;b=k[a+4>>2]|0;c=(l[e+50>>0]|0)<<8|(l[e+49>>0]|0)<<16|(l[e+51>>0]|0);d=b+c|0;e=(l[e+53>>0]|0)<<8|(l[e+52>>0]|0)<<16|(l[e+54>>0]|0);if(!e){o=0;r=p;return o|0}k[m>>2]=d;k[a+96>>2]=d;k[a+104>>2]=e;k[a+100>>2]=b+(e+c);k[a+108>>2]=0;k[a+112>>2]=0;k[o+20>>2]=0;k[o>>2]=0;k[o+4>>2]=0;k[o+8>>2]=0;k[o+12>>2]=0;i[o+16>>0]=0;a:do if(qb(m,o)|0){f=a+268|0;c=a+272|0;b=k[c>>2]|0;if((b|0)!=(n|0)){if(b>>>0<=n>>>0){do if((k[a+276>>2]|0)>>>0<n>>>0)if(gb(f,n,(b+1|0)==(n|0),2,0)|0){b=k[c>>2]|0;break}else{i[a+280>>0]=1;b=0;break a}while(0);$c((k[f>>2]|0)+(b<<1)|0,0,n-b<<1|0)|0}k[c>>2]=n}if(!n){k[h>>2]=1138;k[h+4>>2]=906;k[h+8>>2]=1769;yc(g,1084,h)|0;xc(g)|0;b=1;break}c=0;d=0;e=0;b=k[f>>2]|0;while(1){h=sb(m,o)|0;c=h+c&255;d=(sb(m,o)|0)+d&255;j[b>>1]=d<<8|c;e=e+1|0;if((e|0)==(n|0)){b=1;break}else b=b+2|0}}else b=0;while(0);nb(o);o=b;r=p;return o|0}function Ib(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,m=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;E=r;r=r+2416|0;g=E;f=E+1904|0;D=E+1880|0;B=E+980|0;C=E+80|0;A=E+16|0;e=k[a+88>>2]|0;z=(l[e+63>>0]|0)<<8|(l[e+64>>0]|0);y=a+92|0;b=k[a+4>>2]|0;c=(l[e+58>>0]|0)<<8|(l[e+57>>0]|0)<<16|(l[e+59>>0]|0);d=b+c|0;e=(l[e+61>>0]|0)<<8|(l[e+60>>0]|0)<<16|(l[e+62>>0]|0);if(!e){D=0;r=E;return D|0}k[y>>2]=d;k[a+96>>2]=d;k[a+104>>2]=e;k[a+100>>2]=b+(e+c);k[a+108>>2]=0;k[a+112>>2]=0;k[D+20>>2]=0;k[D>>2]=0;k[D+4>>2]=0;k[D+8>>2]=0;k[D+12>>2]=0;i[D+16>>0]=0;if(qb(y,D)|0){c=0;d=-7;e=-7;while(1){k[B+(c<<2)>>2]=d;k[C+(c<<2)>>2]=e;b=(d|0)>6;c=c+1|0;if((c|0)==225)break;else{d=b?-7:d+1|0;e=(b&1)+e|0}}b=A;c=b+64|0;do{k[b>>2]=0;b=b+4|0}while((b|0)<(c|0));x=a+284|0;c=z*3|0;d=a+288|0;b=k[d>>2]|0;a:do if((b|0)==(c|0))h=13;else{if(b>>>0<=c>>>0){do if((k[a+292>>2]|0)>>>0<c>>>0)if(gb(x,c,(b+1|0)==(c|0),2,0)|0){b=k[d>>2]|0;break}else{i[a+296>>0]=1;b=0;break a}while(0);$c((k[x>>2]|0)+(b<<1)|0,0,c-b<<1|0)|0}k[d>>2]=c;h=13}while(0);do if((h|0)==13){if(!z){k[g>>2]=1138;k[g+4>>2]=906;k[g+8>>2]=1769;yc(f,1084,g)|0;xc(f)|0;b=1;break}d=A+4|0;e=A+8|0;a=A+12|0;f=A+16|0;g=A+20|0;h=A+24|0;m=A+28|0;n=A+32|0;o=A+36|0;p=A+40|0;q=A+44|0;s=A+48|0;t=A+52|0;u=A+56|0;v=A+60|0;w=0;c=k[x>>2]|0;while(1){b=0;do{F=sb(y,D)|0;x=b<<1;G=A+(x<<2)|0;k[G>>2]=(k[G>>2]|0)+(k[B+(F<<2)>>2]|0)&7;x=A+((x|1)<<2)|0;k[x>>2]=(k[x>>2]|0)+(k[C+(F<<2)>>2]|0)&7;b=b+1|0}while((b|0)!=8);F=l[1717+(k[g>>2]|0)>>0]|0;j[c>>1]=(l[1717+(k[d>>2]|0)>>0]|0)<<3|(l[1717+(k[A>>2]|0)>>0]|0)|(l[1717+(k[e>>2]|0)>>0]|0)<<6|(l[1717+(k[a>>2]|0)>>0]|0)<<9|(l[1717+(k[f>>2]|0)>>0]|0)<<12|F<<15;G=l[1717+(k[p>>2]|0)>>0]|0;j[c+2>>1]=(l[1717+(k[h>>2]|0)>>0]|0)<<2|F>>>1|(l[1717+(k[m>>2]|0)>>0]|0)<<5|(l[1717+(k[n>>2]|0)>>0]|0)<<8|(l[1717+(k[o>>2]|0)>>0]|0)<<11|G<<14;j[c+4>>1]=(l[1717+(k[q>>2]|0)>>0]|0)<<1|G>>>2|(l[1717+(k[s>>2]|0)>>0]|0)<<4|(l[1717+(k[t>>2]|0)>>0]|0)<<7|(l[1717+(k[u>>2]|0)>>0]|0)<<10|(l[1717+(k[v>>2]|0)>>0]|0)<<13;w=w+1|0;if((w|0)==(z|0)){b=1;break}else c=c+6|0}}while(0)}else b=0;nb(D);G=b;r=E;return G|0}function Jb(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,m=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ia=0,ja=0;ga=r;r=r+656|0;ea=ga+112|0;ca=ga+96|0;ba=ga+80|0;aa=ga+64|0;$=ga+48|0;fa=ga+32|0;da=ga+16|0;_=ga;Y=ga+144|0;Z=ga+128|0;R=a+240|0;S=k[R>>2]|0;V=a+256|0;W=k[V>>2]|0;c=i[(k[a+88>>2]|0)+17>>0]|0;X=d>>>2;if(!(c<<24>>24)){r=ga;return 1}T=(h|0)==0;U=h+-1|0;K=(f&1|0)!=0;L=d<<1;M=a+92|0;N=a+116|0;O=a+140|0;P=a+236|0;Q=g+-1|0;J=(e&1|0)!=0;I=a+188|0;D=a+252|0;E=X+1|0;F=X+2|0;G=X+3|0;H=Q<<4;B=c&255;c=0;f=0;e=1;C=0;do{if(!T){z=k[b+(C<<2)>>2]|0;A=0;while(1){w=A&1;j=(w|0)==0;v=(w<<5^32)+-16|0;w=(w<<1^2)+-1|0;y=j?g:-1;m=j?0:Q;a=(A|0)==(U|0);x=K&a;if((m|0)!=(y|0)){u=K&a^1;t=j?z:z+H|0;while(1){if((e|0)==1)e=sb(M,N)|0|512;s=e&7;e=e>>>3;j=l[1811+s>>0]|0;a=0;do{p=(sb(M,O)|0)+f|0;q=p-S|0;f=q>>31;f=f&p|q&~f;if((k[R>>2]|0)>>>0<=f>>>0){k[_>>2]=1138;k[_+4>>2]=906;k[_+8>>2]=1769;yc(Y,1084,_)|0;xc(Y)|0}k[Z+(a<<2)>>2]=k[(k[P>>2]|0)+(f<<2)>>2];a=a+1|0}while(a>>>0<j>>>0);q=J&(m|0)==(Q|0);if(x|q){p=0;do{n=ha(p,d)|0;a=t+n|0;j=(p|0)==0|u;o=p<<1;ja=(sb(M,I)|0)+c|0;ia=ja-W|0;c=ia>>31;c=c&ja|ia&~c;do if(q){if(!j){ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c;break}k[a>>2]=k[Z+((l[1819+(s<<2)+o>>0]|0)<<2)>>2];if((k[V>>2]|0)>>>0<=c>>>0){k[ca>>2]=1138;k[ca+4>>2]=906;k[ca+8>>2]=1769;yc(Y,1084,ca)|0;xc(Y)|0}k[t+(n+4)>>2]=k[(k[D>>2]|0)+(c<<2)>>2];ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c}else{if(!j){ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c;break}k[a>>2]=k[Z+((l[1819+(s<<2)+o>>0]|0)<<2)>>2];if((k[V>>2]|0)>>>0<=c>>>0){k[ba>>2]=1138;k[ba+4>>2]=906;k[ba+8>>2]=1769;yc(Y,1084,ba)|0;xc(Y)|0}k[t+(n+4)>>2]=k[(k[D>>2]|0)+(c<<2)>>2];ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c;k[t+(n+8)>>2]=k[Z+((l[(o|1)+(1819+(s<<2))>>0]|0)<<2)>>2];if((k[V>>2]|0)>>>0<=c>>>0){k[ea>>2]=1138;k[ea+4>>2]=906;k[ea+8>>2]=1769;yc(Y,1084,ea)|0;xc(Y)|0}k[t+(n+12)>>2]=k[(k[D>>2]|0)+(c<<2)>>2]}while(0);p=p+1|0}while((p|0)!=2)}else{k[t>>2]=k[Z+((l[1819+(s<<2)>>0]|0)<<2)>>2];ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c;if((k[V>>2]|0)>>>0<=c>>>0){k[da>>2]=1138;k[da+4>>2]=906;k[da+8>>2]=1769;yc(Y,1084,da)|0;xc(Y)|0}k[t+4>>2]=k[(k[D>>2]|0)+(c<<2)>>2];k[t+8>>2]=k[Z+((l[1819+(s<<2)+1>>0]|0)<<2)>>2];ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c;if((k[V>>2]|0)>>>0<=c>>>0){k[fa>>2]=1138;k[fa+4>>2]=906;k[fa+8>>2]=1769;yc(Y,1084,fa)|0;xc(Y)|0}k[t+12>>2]=k[(k[D>>2]|0)+(c<<2)>>2];k[t+(X<<2)>>2]=k[Z+((l[1819+(s<<2)+2>>0]|0)<<2)>>2];ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c;if((k[V>>2]|0)>>>0<=c>>>0){k[$>>2]=1138;k[$+4>>2]=906;k[$+8>>2]=1769;yc(Y,1084,$)|0;xc(Y)|0}k[t+(E<<2)>>2]=k[(k[D>>2]|0)+(c<<2)>>2];k[t+(F<<2)>>2]=k[Z+((l[1819+(s<<2)+3>>0]|0)<<2)>>2];ia=(sb(M,I)|0)+c|0;ja=ia-W|0;c=ja>>31;c=c&ia|ja&~c;if((k[V>>2]|0)>>>0<=c>>>0){k[aa>>2]=1138;k[aa+4>>2]=906;k[aa+8>>2]=1769;yc(Y,1084,aa)|0;xc(Y)|0}k[t+(G<<2)>>2]=k[(k[D>>2]|0)+(c<<2)>>2]}m=m+w|0;if((m|0)==(y|0))break;else t=t+v|0}}A=A+1|0;if((A|0)==(h|0))break;else z=z+L|0}}C=C+1|0}while((C|0)!=(B|0));r=ga;return 1}function Kb(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0;ma=r;r=r+608|0;ja=ma+48|0;la=ma+32|0;ka=ma+16|0;ia=ma;ga=ma+96|0;ha=ma+80|0;fa=ma+64|0;S=a+240|0;T=k[S>>2]|0;W=a+256|0;ca=k[W>>2]|0;da=a+272|0;ea=k[da>>2]|0;c=k[a+88>>2]|0;U=(l[c+63>>0]|0)<<8|(l[c+64>>0]|0);c=i[c+17>>0]|0;if(!(c<<24>>24)){r=ma;return 1}V=(h|0)==0;X=h+-1|0;Y=d<<1;Z=a+92|0;_=a+116|0;$=g+-1|0;aa=a+212|0;ba=a+188|0;R=(e&1|0)==0;Q=(f&1|0)==0;K=a+288|0;L=a+284|0;M=a+252|0;N=a+140|0;O=a+236|0;P=a+164|0;I=a+268|0;J=$<<5;G=c&255;c=0;e=0;f=0;a=0;j=1;H=0;do{if(!V){E=k[b+(H<<2)>>2]|0;F=0;while(1){C=F&1;n=(C|0)==0;B=(C<<6^64)+-32|0;C=(C<<1^2)+-1|0;D=n?g:-1;o=n?0:$;if((o|0)!=(D|0)){A=Q|(F|0)!=(X|0);z=n?E:E+J|0;while(1){if((j|0)==1)j=sb(Z,_)|0|512;y=j&7;j=j>>>3;p=l[1811+y>>0]|0;n=0;do{w=(sb(Z,P)|0)+e|0;x=w-ea|0;e=x>>31;e=e&w|x&~e;if((k[da>>2]|0)>>>0<=e>>>0){k[ia>>2]=1138;k[ia+4>>2]=906;k[ia+8>>2]=1769;yc(ga,1084,ia)|0;xc(ga)|0}k[fa+(n<<2)>>2]=m[(k[I>>2]|0)+(e<<1)>>1];n=n+1|0}while(n>>>0<p>>>0);n=0;do{w=(sb(Z,N)|0)+a|0;x=w-T|0;a=x>>31;a=a&w|x&~a;if((k[S>>2]|0)>>>0<=a>>>0){k[ka>>2]=1138;k[ka+4>>2]=906;k[ka+8>>2]=1769;yc(ga,1084,ka)|0;xc(ga)|0}k[ha+(n<<2)>>2]=k[(k[O>>2]|0)+(a<<2)>>2];n=n+1|0}while(n>>>0<p>>>0);x=R|(o|0)!=($|0);v=0;w=z;while(1){u=A|(v|0)==0;t=v<<1;q=0;s=w;while(1){p=(sb(Z,aa)|0)+c|0;n=p-U|0;c=n>>31;c=c&p|n&~c;n=(sb(Z,ba)|0)+f|0;p=n-ca|0;f=p>>31;f=f&n|p&~f;if((x|(q|0)==0)&u){n=l[q+t+(1819+(y<<2))>>0]|0;p=c*3|0;if((k[K>>2]|0)>>>0<=p>>>0){k[la>>2]=1138;k[la+4>>2]=906;k[la+8>>2]=1769;yc(ga,1084,la)|0;xc(ga)|0}na=k[L>>2]|0;k[s>>2]=(m[na+(p<<1)>>1]|0)<<16|k[fa+(n<<2)>>2];k[s+4>>2]=(m[na+(p+2<<1)>>1]|0)<<16|(m[na+(p+1<<1)>>1]|0);k[s+8>>2]=k[ha+(n<<2)>>2];if((k[W>>2]|0)>>>0<=f>>>0){k[ja>>2]=1138;k[ja+4>>2]=906;k[ja+8>>2]=1769;yc(ga,1084,ja)|0;xc(ga)|0}k[s+12>>2]=k[(k[M>>2]|0)+(f<<2)>>2]}q=q+1|0;if((q|0)==2)break;else s=s+16|0}v=v+1|0;if((v|0)==2)break;else w=w+d|0}o=o+C|0;if((o|0)==(D|0))break;else z=z+B|0}}F=F+1|0;if((F|0)==(h|0))break;else E=E+Y|0}}H=H+1|0}while((H|0)!=(G|0));r=ma;return 1}function Lb(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0;$=r;r=r+576|0;_=$+32|0;Z=$+16|0;Y=$;X=$+64|0;W=$+48|0;M=a+272|0;N=k[M>>2]|0;c=k[a+88>>2]|0;O=(l[c+63>>0]|0)<<8|(l[c+64>>0]|0);c=i[c+17>>0]|0;if(!(c<<24>>24)){r=$;return 1}P=(h|0)==0;Q=h+-1|0;R=d<<1;S=a+92|0;T=a+116|0;U=g+-1|0;V=a+212|0;L=(f&1|0)==0;I=a+288|0;J=a+284|0;K=a+164|0;G=a+268|0;H=U<<4;F=c&255;E=(e&1|0)!=0;c=0;f=0;a=1;D=0;do{if(!P){B=k[b+(D<<2)>>2]|0;C=0;while(1){z=C&1;e=(z|0)==0;y=(z<<5^32)+-16|0;z=(z<<1^2)+-1|0;A=e?g:-1;j=e?0:U;if((j|0)!=(A|0)){x=L|(C|0)!=(Q|0);w=e?B:B+H|0;while(1){if((a|0)==1)a=sb(S,T)|0|512;v=a&7;a=a>>>3;n=l[1811+v>>0]|0;e=0;do{t=(sb(S,K)|0)+f|0;u=t-N|0;f=u>>31;f=f&t|u&~f;if((k[M>>2]|0)>>>0<=f>>>0){k[Y>>2]=1138;k[Y+4>>2]=906;k[Y+8>>2]=1769;yc(X,1084,Y)|0;xc(X)|0}k[W+(e<<2)>>2]=m[(k[G>>2]|0)+(f<<1)>>1];e=e+1|0}while(e>>>0<n>>>0);u=(j|0)==(U|0)&E;s=0;t=w;while(1){q=x|(s|0)==0;p=s<<1;e=(sb(S,V)|0)+c|0;o=e-O|0;n=o>>31;n=n&e|o&~n;if(q){c=l[1819+(v<<2)+p>>0]|0;e=n*3|0;if((k[I>>2]|0)>>>0<=e>>>0){k[Z>>2]=1138;k[Z+4>>2]=906;k[Z+8>>2]=1769;yc(X,1084,Z)|0;xc(X)|0}o=k[J>>2]|0;k[t>>2]=(m[o+(e<<1)>>1]|0)<<16|k[W+(c<<2)>>2];k[t+4>>2]=(m[o+(e+2<<1)>>1]|0)<<16|(m[o+(e+1<<1)>>1]|0)}o=t+8|0;e=(sb(S,V)|0)+n|0;n=e-O|0;c=n>>31;c=c&e|n&~c;if(!(u|q^1)){e=l[(p|1)+(1819+(v<<2))>>0]|0;n=c*3|0;if((k[I>>2]|0)>>>0<=n>>>0){k[_>>2]=1138;k[_+4>>2]=906;k[_+8>>2]=1769;yc(X,1084,_)|0;xc(X)|0}q=k[J>>2]|0;k[o>>2]=(m[q+(n<<1)>>1]|0)<<16|k[W+(e<<2)>>2];k[t+12>>2]=(m[q+(n+2<<1)>>1]|0)<<16|(m[q+(n+1<<1)>>1]|0)}s=s+1|0;if((s|0)==2)break;else t=t+d|0}j=j+z|0;if((j|0)==(A|0))break;else w=w+y|0}}C=C+1|0;if((C|0)==(h|0))break;else B=B+R|0}}D=D+1|0}while((D|0)!=(F|0));r=$;return 1}function Mb(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,n=0,o=0,p=0,q=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0;ha=r;r=r+608|0;ea=ha+48|0;ga=ha+32|0;fa=ha+16|0;da=ha;ca=ha+96|0;aa=ha+80|0;ba=ha+64|0;S=a+272|0;T=k[S>>2]|0;c=k[a+88>>2]|0;U=(l[c+63>>0]|0)<<8|(l[c+64>>0]|0);c=i[c+17>>0]|0;if(!(c<<24>>24)){r=ha;return 1}V=(h|0)==0;W=h+-1|0;X=d<<1;Y=a+92|0;Z=a+116|0;_=g+-1|0;$=a+212|0;R=(e&1|0)==0;Q=(f&1|0)==0;N=a+288|0;O=a+284|0;P=a+164|0;L=a+268|0;M=_<<5;J=c&255;c=0;e=0;f=0;a=0;j=1;K=0;do{if(!V){H=k[b+(K<<2)>>2]|0;I=0;while(1){F=I&1;n=(F|0)==0;E=(F<<6^64)+-32|0;F=(F<<1^2)+-1|0;G=n?g:-1;o=n?0:_;if((o|0)!=(G|0)){D=Q|(I|0)!=(W|0);C=n?H:H+M|0;while(1){if((j|0)==1)j=sb(Y,Z)|0|512;B=j&7;j=j>>>3;p=l[1811+B>>0]|0;n=0;do{z=(sb(Y,P)|0)+a|0;A=z-T|0;a=A>>31;a=a&z|A&~a;if((k[S>>2]|0)>>>0<=a>>>0){k[da>>2]=1138;k[da+4>>2]=906;k[da+8>>2]=1769;yc(ca,1084,da)|0;xc(ca)|0}k[aa+(n<<2)>>2]=m[(k[L>>2]|0)+(a<<1)>>1];n=n+1|0}while(n>>>0<p>>>0);n=0;do{z=(sb(Y,P)|0)+e|0;A=z-T|0;e=A>>31;e=e&z|A&~e;if((k[S>>2]|0)>>>0<=e>>>0){k[fa>>2]=1138;k[fa+4>>2]=906;k[fa+8>>2]=1769;yc(ca,1084,fa)|0;xc(ca)|0}k[ba+(n<<2)>>2]=m[(k[L>>2]|0)+(e<<1)>>1];n=n+1|0}while(n>>>0<p>>>0);A=R|(o|0)!=(_|0);y=0;z=C;while(1){x=D|(y|0)==0;w=y<<1;u=0;v=z;while(1){t=(sb(Y,$)|0)+f|0;s=t-U|0;f=s>>31;f=f&t|s&~f;s=(sb(Y,$)|0)+c|0;t=s-U|0;c=t>>31;c=c&s|t&~c;if((A|(u|0)==0)&x){s=l[u+w+(1819+(B<<2))>>0]|0;t=f*3|0;n=k[N>>2]|0;if(n>>>0<=t>>>0){k[ga>>2]=1138;k[ga+4>>2]=906;k[ga+8>>2]=1769;yc(ca,1084,ga)|0;xc(ca)|0;n=k[N>>2]|0}p=k[O>>2]|0;q=c*3|0;if(n>>>0>q>>>0)n=p;else{k[ea>>2]=1138;k[ea+4>>2]=906;k[ea+8>>2]=1769;yc(ca,1084,ea)|0;xc(ca)|0;n=k[O>>2]|0}k[v>>2]=(m[p+(t<<1)>>1]|0)<<16|k[aa+(s<<2)>>2];k[v+4>>2]=(m[p+(t+2<<1)>>1]|0)<<16|(m[p+(t+1<<1)>>1]|0);k[v+8>>2]=(m[n+(q<<1)>>1]|0)<<16|k[ba+(s<<2)>>2];k[v+12>>2]=(m[n+(q+2<<1)>>1]|0)<<16|(m[n+(q+1<<1)>>1]|0)}u=u+1|0;if((u|0)==2)break;else v=v+16|0}y=y+1|0;if((y|0)==2)break;else z=z+d|0}o=o+F|0;if((o|0)==(G|0))break;else C=C+E|0}}I=I+1|0;if((I|0)==(h|0))break;else H=H+X|0}}K=K+1|0}while((K|0)!=(J|0));r=ha;return 1}function Nb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,j=0;j=r;r=r+576|0;h=j+48|0;f=j+32|0;e=j+16|0;d=j;g=j+64|0;k[a>>2]=0;b=a+284|0;c=k[b>>2]|0;if(c){if(!(c&7))kb(c,0,0,1,0)|0;else{k[d>>2]=1138;k[d+4>>2]=2502;k[d+8>>2]=1504;yc(g,1084,d)|0;xc(g)|0}k[b>>2]=0;k[a+288>>2]=0;k[a+292>>2]=0}i[a+296>>0]=0;c=a+268|0;b=k[c>>2]|0;if(b){if(!(b&7))kb(b,0,0,1,0)|0;else{k[e>>2]=1138;k[e+4>>2]=2502;k[e+8>>2]=1504;yc(g,1084,e)|0;xc(g)|0}k[c>>2]=0;k[a+272>>2]=0;k[a+276>>2]=0}i[a+280>>0]=0;b=a+252|0;c=k[b>>2]|0;if(c){if(!(c&7))kb(c,0,0,1,0)|0;else{k[f>>2]=1138;k[f+4>>2]=2502;k[f+8>>2]=1504;yc(g,1084,f)|0;xc(g)|0}k[b>>2]=0;k[a+256>>2]=0;k[a+260>>2]=0}i[a+264>>0]=0;b=a+236|0;c=k[b>>2]|0;if(!c){h=a+248|0;i[h>>0]=0;h=a+212|0;nb(h);h=a+188|0;nb(h);h=a+164|0;nb(h);h=a+140|0;nb(h);h=a+116|0;nb(h);r=j;return}if(!(c&7))kb(c,0,0,1,0)|0;else{k[h>>2]=1138;k[h+4>>2]=2502;k[h+8>>2]=1504;yc(g,1084,h)|0;xc(g)|0}k[b>>2]=0;k[a+240>>2]=0;k[a+244>>2]=0;h=a+248|0;i[h>>0]=0;h=a+212|0;nb(h);h=a+188|0;nb(h);h=a+164|0;nb(h);h=a+140|0;nb(h);h=a+116|0;nb(h);r=j;return}function Ob(a,b){a=a|0;b=b|0;var c=0;c=r;r=r+16|0;k[c>>2]=b;b=k[60]|0;zc(b,a,c)|0;tc(10,b)|0;Aa()}function Pb(){var a=0,b=0;a=r;r=r+16|0;if(!(Ka(192,2)|0)){b=va(k[47]|0)|0;r=a;return b|0}else Ob(2078,a);return 0}function Qb(a){a=a|0;Tc(a);return}function Rb(a){a=a|0;var b=0;b=r;r=r+16|0;Wa[a&3]();Ob(2127,b)}function Sb(){var a=0,b=0;a=Pb()|0;if(((a|0)!=0?(b=k[a>>2]|0,(b|0)!=0):0)?(a=b+48|0,(k[a>>2]&-256|0)==1126902528?(k[a+4>>2]|0)==1129074247:0):0)Rb(k[b+12>>2]|0);b=k[26]|0;k[26]=b+0;Rb(b)}function Tb(a){a=a|0;return}function Ub(a){a=a|0;return}function Vb(a){a=a|0;return}function Wb(a){a=a|0;return}function Xb(a){a=a|0;Qb(a);return}function Yb(a){a=a|0;Qb(a);return}function Zb(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;g=r;r=r+64|0;f=g;if((a|0)!=(b|0))if((b|0)!=0?(e=bc(b,24,40,0)|0,(e|0)!=0):0){b=f;d=b+56|0;do{k[b>>2]=0;b=b+4|0}while((b|0)<(d|0));k[f>>2]=e;k[f+8>>2]=a;k[f+12>>2]=-1;k[f+48>>2]=1;Ya[k[(k[e>>2]|0)+28>>2]&3](e,f,k[c>>2]|0,1);if((k[f+24>>2]|0)==1){k[c>>2]=k[f+16>>2];b=1}else b=0}else b=0;else b=1;r=g;return b|0}function _b(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;a=b+16|0;e=k[a>>2]|0;do if(e){if((e|0)!=(c|0)){d=b+36|0;k[d>>2]=(k[d>>2]|0)+1;k[b+24>>2]=2;i[b+54>>0]=1;break}a=b+24|0;if((k[a>>2]|0)==2)k[a>>2]=d}else{k[a>>2]=c;k[b+24>>2]=d;k[b+36>>2]=1}while(0);return}function $b(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if((a|0)==(k[b+8>>2]|0))_b(0,b,c,d);return}function ac(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if((a|0)==(k[b+8>>2]|0))_b(0,b,c,d);else{a=k[a+8>>2]|0;Ya[k[(k[a>>2]|0)+28>>2]&3](a,b,c,d)}return}function bc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,l=0,m=0,n=0,o=0,p=0,q=0;q=r;r=r+64|0;p=q;o=k[a>>2]|0;n=a+(k[o+-8>>2]|0)|0;o=k[o+-4>>2]|0;k[p>>2]=c;k[p+4>>2]=a;k[p+8>>2]=b;k[p+12>>2]=d;d=p+16|0;a=p+20|0;b=p+24|0;e=p+28|0;f=p+32|0;g=p+40|0;h=(o|0)==(c|0);l=d;m=l+36|0;do{k[l>>2]=0;l=l+4|0}while((l|0)<(m|0));j[d+36>>1]=0;i[d+38>>0]=0;a:do if(h){k[p+48>>2]=1;Xa[k[(k[c>>2]|0)+20>>2]&3](c,p,n,n,1,0);d=(k[b>>2]|0)==1?n:0}else{Sa[k[(k[o>>2]|0)+24>>2]&3](o,p,n,1,0);switch(k[p+36>>2]|0){case 0:{d=(k[g>>2]|0)==1&(k[e>>2]|0)==1&(k[f>>2]|0)==1?k[a>>2]|0:0;break a}case 1:break;default:{d=0;break a}}if((k[b>>2]|0)!=1?!((k[g>>2]|0)==0&(k[e>>2]|0)==1&(k[f>>2]|0)==1):0){d=0;break}d=k[d>>2]|0}while(0);r=q;return d|0}function cc(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;i[b+53>>0]=1;do if((k[b+4>>2]|0)==(d|0)){i[b+52>>0]=1;d=b+16|0;a=k[d>>2]|0;if(!a){k[d>>2]=c;k[b+24>>2]=e;k[b+36>>2]=1;if(!((e|0)==1?(k[b+48>>2]|0)==1:0))break;i[b+54>>0]=1;break}if((a|0)!=(c|0)){e=b+36|0;k[e>>2]=(k[e>>2]|0)+1;i[b+54>>0]=1;break}a=b+24|0;d=k[a>>2]|0;if((d|0)==2){k[a>>2]=e;d=e}if((d|0)==1?(k[b+48>>2]|0)==1:0)i[b+54>>0]=1}while(0);return}function dc(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;a:do if((a|0)==(k[b+8>>2]|0)){if((k[b+4>>2]|0)==(c|0)?(f=b+28|0,(k[f>>2]|0)!=1):0)k[f>>2]=d}else{if((a|0)!=(k[b>>2]|0)){h=k[a+8>>2]|0;Sa[k[(k[h>>2]|0)+24>>2]&3](h,b,c,d,e);break}if((k[b+16>>2]|0)!=(c|0)?(g=b+20|0,(k[g>>2]|0)!=(c|0)):0){k[b+32>>2]=d;d=b+44|0;if((k[d>>2]|0)==4)break;f=b+52|0;i[f>>0]=0;j=b+53|0;i[j>>0]=0;a=k[a+8>>2]|0;Xa[k[(k[a>>2]|0)+20>>2]&3](a,b,c,c,1,e);if(i[j>>0]|0){if(!(i[f>>0]|0)){f=1;h=13}}else{f=0;h=13}do if((h|0)==13){k[g>>2]=c;j=b+40|0;k[j>>2]=(k[j>>2]|0)+1;if((k[b+36>>2]|0)==1?(k[b+24>>2]|0)==2:0){i[b+54>>0]=1;if(f)break}else h=16;if((h|0)==16?f:0)break;k[d>>2]=4;break a}while(0);k[d>>2]=3;break}if((d|0)==1)k[b+32>>2]=1}while(0);return}function ec(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0;do if((a|0)==(k[b+8>>2]|0)){if((k[b+4>>2]|0)==(c|0)?(g=b+28|0,(k[g>>2]|0)!=1):0)k[g>>2]=d}else if((a|0)==(k[b>>2]|0)){if((k[b+16>>2]|0)!=(c|0)?(f=b+20|0,(k[f>>2]|0)!=(c|0)):0){k[b+32>>2]=d;k[f>>2]=c;e=b+40|0;k[e>>2]=(k[e>>2]|0)+1;if((k[b+36>>2]|0)==1?(k[b+24>>2]|0)==2:0)i[b+54>>0]=1;k[b+44>>2]=4;break}if((d|0)==1)k[b+32>>2]=1}while(0);return}function fc(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;if((a|0)==(k[b+8>>2]|0))cc(0,b,c,d,e);else{a=k[a+8>>2]|0;Xa[k[(k[a>>2]|0)+20>>2]&3](a,b,c,d,e,f)}return}function gc(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;if((a|0)==(k[b+8>>2]|0))cc(0,b,c,d,e);return}function hc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;e=r;r=r+16|0;d=e;k[d>>2]=k[c>>2];a=Ra[k[(k[a>>2]|0)+16>>2]&7](a,b,d)|0;if(a)k[c>>2]=k[d>>2];r=e;return a&1|0}function ic(a){a=a|0;if(!a)a=0;else a=(bc(a,24,72,0)|0)!=0;return a&1|0}function jc(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=0;e=r;r=r+48|0;g=e+32|0;c=e+24|0;h=e+16|0;f=e;e=e+36|0;a=Pb()|0;if((a|0)!=0?(d=k[a>>2]|0,(d|0)!=0):0){a=d+48|0;b=k[a>>2]|0;a=k[a+4>>2]|0;if(!((b&-256|0)==1126902528&(a|0)==1129074247)){k[c>>2]=2406;Ob(2356,c)}if((b|0)==1126902529&(a|0)==1129074247)a=k[d+44>>2]|0;else a=d+80|0;k[e>>2]=a;d=k[d>>2]|0;a=k[d+4>>2]|0;if(Ra[k[(k[8>>2]|0)+16>>2]&7](8,d,e)|0){h=k[e>>2]|0;h=Ua[k[(k[h>>2]|0)+8>>2]&1](h)|0;k[f>>2]=2406;k[f+4>>2]=a;k[f+8>>2]=h;Ob(2270,f)}else{k[h>>2]=2406;k[h+4>>2]=a;Ob(2315,h)}}Ob(2394,g)}function kc(){var a=0;a=r;r=r+16|0;if(!(Fa(188,6)|0)){r=a;return}else Ob(2167,a)}function lc(a){a=a|0;var b=0;b=r;r=r+16|0;Tc(a);if(!(wa(k[47]|0,0)|0)){r=b;return}else Ob(2217,b)}function mc(a){a=a|0;var b=0,c=0;b=0;while(1){if((l[2415+b>>0]|0)==(a|0)){c=2;break}b=b+1|0;if((b|0)==87){b=87;a=2503;c=5;break}}if((c|0)==2)if(!b)a=2503;else{a=2503;c=5}if((c|0)==5)while(1){c=a;while(1){a=c+1|0;if(!(i[c>>0]|0))break;else c=a}b=b+-1|0;if(!b)break;else c=5}return a|0}function nc(){var a=0;if(!0)a=248;else{a=(za()|0)+60|0;a=k[a>>2]|0}return a|0}function oc(a){a=a|0;var b=0;if(a>>>0>4294963200){b=nc()|0;k[b>>2]=0-a;a=-1}return a|0}function pc(a,b){a=+a;b=b|0;var c=0,d=0,e=0;p[t>>3]=a;c=k[t>>2]|0;d=k[t+4>>2]|0;e=ad(c|0,d|0,52)|0;e=e&2047;switch(e|0){case 0:{if(a!=0.0){a=+pc(a*18446744073709552.0e3,b);c=(k[b>>2]|0)+-64|0}else c=0;k[b>>2]=c;break}case 2047:break;default:{k[b>>2]=e+-1022;k[t>>2]=c;k[t+4>>2]=d&-2146435073|1071644672;a=+p[t>>3]}}return +a}function qc(a,b){a=+a;b=b|0;return +(+pc(a,b))}function rc(a,b,c){a=a|0;b=b|0;c=c|0;do if(a){if(b>>>0<128){i[a>>0]=b;a=1;break}if(b>>>0<2048){i[a>>0]=b>>>6|192;i[a+1>>0]=b&63|128;a=2;break}if(b>>>0<55296|(b&-8192|0)==57344){i[a>>0]=b>>>12|224;i[a+1>>0]=b>>>6&63|128;i[a+2>>0]=b&63|128;a=3;break}if((b+-65536|0)>>>0<1048576){i[a>>0]=b>>>18|240;i[a+1>>0]=b>>>12&63|128;i[a+2>>0]=b>>>6&63|128;i[a+3>>0]=b&63|128;a=4;break}else{a=nc()|0;k[a>>2]=84;a=-1;break}}else a=1;while(0);return a|0}function sc(a,b){a=a|0;b=b|0;if(!a)a=0;else a=rc(a,b,0)|0;return a|0}function tc(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0;if((k[b+76>>2]|0)>=0?(Cc(b)|0)!=0:0){if((i[b+75>>0]|0)!=(a|0)?(d=b+20|0,e=k[d>>2]|0,e>>>0<(k[b+16>>2]|0)>>>0):0){k[d>>2]=e+1;i[e>>0]=a;c=a&255}else c=Ec(b,a)|0;Dc(b)}else g=3;do if((g|0)==3){if((i[b+75>>0]|0)!=(a|0)?(f=b+20|0,c=k[f>>2]|0,c>>>0<(k[b+16>>2]|0)>>>0):0){k[f>>2]=c+1;i[c>>0]=a;c=a&255;break}c=Ec(b,a)|0}while(0);return c|0}function uc(a,b){a=a|0;b=b|0;return (wc(a,Lc(a)|0,1,b)|0)+-1|0}function vc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=c+16|0;e=k[d>>2]|0;if(!e)if(!(Jc(c)|0)){e=k[d>>2]|0;f=4}else d=0;else f=4;a:do if((f|0)==4){g=c+20|0;f=k[g>>2]|0;if((e-f|0)>>>0<b>>>0){d=Ra[k[c+36>>2]&7](c,a,b)|0;break}b:do if((i[c+75>>0]|0)>-1){d=b;while(1){if(!d){e=f;d=0;break b}e=d+-1|0;if((i[a+e>>0]|0)==10)break;else d=e}if((Ra[k[c+36>>2]&7](c,a,d)|0)>>>0<d>>>0)break a;b=b-d|0;a=a+d|0;e=k[g>>2]|0}else{e=f;d=0}while(0);cd(e|0,a|0,b|0)|0;k[g>>2]=(k[g>>2]|0)+b;d=d+b|0}while(0);return d|0}function wc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=ha(c,b)|0;if((k[d+76>>2]|0)>-1){f=(Cc(d)|0)==0;a=vc(a,e,d)|0;if(!f)Dc(d)}else a=vc(a,e,d)|0;if((a|0)!=(e|0))c=(a>>>0)/(b>>>0)|0;return c|0}function xc(a){a=a|0;var b=0,c=0,d=0,e=0;d=k[61]|0;if((k[d+76>>2]|0)>-1)e=Cc(d)|0;else e=0;do if((uc(a,d)|0)<0)b=1;else{if((i[d+75>>0]|0)!=10?(b=d+20|0,c=k[b>>2]|0,c>>>0<(k[d+16>>2]|0)>>>0):0){k[b>>2]=c+1;i[c>>0]=10;b=0;break}b=(Ec(d,10)|0)<0}while(0);if(e)Dc(d);return b<<31>>31|0}function yc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=r;r=r+16|0;e=d;k[e>>2]=c;c=Bc(a,b,e)|0;r=d;return c|0}function zc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,s=0;s=r;r=r+224|0;n=s+120|0;q=s+80|0;p=s;o=s+136|0;d=q;e=d+40|0;do{k[d>>2]=0;d=d+4|0}while((d|0)<(e|0));k[n>>2]=k[c>>2];if((Mc(0,b,n,p,q)|0)<0)c=-1;else{if((k[a+76>>2]|0)>-1)l=Cc(a)|0;else l=0;c=k[a>>2]|0;m=c&32;if((i[a+74>>0]|0)<1)k[a>>2]=c&-33;c=a+48|0;if(!(k[c>>2]|0)){e=a+44|0;f=k[e>>2]|0;k[e>>2]=o;g=a+28|0;k[g>>2]=o;h=a+20|0;k[h>>2]=o;k[c>>2]=80;j=a+16|0;k[j>>2]=o+80;d=Mc(a,b,n,p,q)|0;if(f){Ra[k[a+36>>2]&7](a,0,0)|0;d=(k[h>>2]|0)==0?-1:d;k[e>>2]=f;k[c>>2]=0;k[j>>2]=0;k[g>>2]=0;k[h>>2]=0}}else d=Mc(a,b,n,p,q)|0;c=k[a>>2]|0;k[a>>2]=c|m;if(l)Dc(a);c=(c&32|0)==0?d:-1}r=s;return c|0}function Ac(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,l=0,m=0;m=r;r=r+128|0;e=m+112|0;l=m;f=l;g=252;h=f+112|0;do{k[f>>2]=k[g>>2];f=f+4|0;g=g+4|0}while((f|0)<(h|0));if((b+-1|0)>>>0>2147483646)if(!b){b=1;j=4}else{b=nc()|0;k[b>>2]=75;b=-1}else{e=a;j=4}if((j|0)==4){j=-2-e|0;j=b>>>0>j>>>0?j:b;k[l+48>>2]=j;a=l+20|0;k[a>>2]=e;k[l+44>>2]=e;b=e+j|0;e=l+16|0;k[e>>2]=b;k[l+28>>2]=b;b=zc(l,c,d)|0;if(j){c=k[a>>2]|0;i[c+(((c|0)==(k[e>>2]|0))<<31>>31)>>0]=0}}r=m;return b|0}function Bc(a,b,c){a=a|0;b=b|0;c=c|0;return Ac(a,2147483647,b,c)|0}function Cc(a){a=a|0;return 0}function Dc(a){a=a|0;return}function Ec(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,j=0;j=r;r=r+16|0;h=j;g=b&255;i[h>>0]=g;d=a+16|0;e=k[d>>2]|0;if(!e)if(!(Jc(a)|0)){e=k[d>>2]|0;f=4}else c=-1;else f=4;do if((f|0)==4){d=a+20|0;f=k[d>>2]|0;if(f>>>0<e>>>0?(c=b&255,(c|0)!=(i[a+75>>0]|0)):0){k[d>>2]=f+1;i[f>>0]=g;break}if((Ra[k[a+36>>2]&7](a,h,1)|0)==1)c=l[h>>0]|0;else c=-1}while(0);r=j;return c|0}function Fc(a){a=a|0;var b=0,c=0;b=r;r=r+16|0;c=b;k[c>>2]=k[a+60>>2];a=oc(Ca(6,c|0)|0)|0;r=b;return a|0}function Gc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0;e=r;r=r+32|0;f=e;d=e+20|0;k[f>>2]=k[a+60>>2];k[f+4>>2]=0;k[f+8>>2]=b;k[f+12>>2]=d;k[f+16>>2]=c;if((oc(Ja(140,f|0)|0)|0)<0){k[d>>2]=-1;a=-1}else a=k[d>>2]|0;r=e;return a|0}function Hc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0;p=r;r=r+48|0;m=p+16|0;l=p;d=p+32|0;n=a+28|0;e=k[n>>2]|0;k[d>>2]=e;o=a+20|0;e=(k[o>>2]|0)-e|0;k[d+4>>2]=e;k[d+8>>2]=b;k[d+12>>2]=c;i=a+60|0;j=a+44|0;b=2;e=e+c|0;while(1){if(!(k[49]|0)){k[m>>2]=k[i>>2];k[m+4>>2]=d;k[m+8>>2]=b;g=oc(Na(146,m|0)|0)|0}else{Ba(7,a|0);k[l>>2]=k[i>>2];k[l+4>>2]=d;k[l+8>>2]=b;g=oc(Na(146,l|0)|0)|0;ua(0)}if((e|0)==(g|0)){e=6;break}if((g|0)<0){e=8;break}e=e-g|0;f=k[d+4>>2]|0;if(g>>>0<=f>>>0)if((b|0)==2){k[n>>2]=(k[n>>2]|0)+g;h=f;b=2}else h=f;else{h=k[j>>2]|0;k[n>>2]=h;k[o>>2]=h;h=k[d+12>>2]|0;g=g-f|0;d=d+8|0;b=b+-1|0}k[d>>2]=(k[d>>2]|0)+g;k[d+4>>2]=h-g}if((e|0)==6){m=k[j>>2]|0;k[a+16>>2]=m+(k[a+48>>2]|0);a=m;k[n>>2]=a;k[o>>2]=a}else if((e|0)==8){k[a+16>>2]=0;k[n>>2]=0;k[o>>2]=0;k[a>>2]=k[a>>2]|32;if((b|0)==2)c=0;else c=c-(k[d+4>>2]|0)|0}r=p;return c|0}function Ic(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;e=r;r=r+80|0;d=e;k[a+36>>2]=3;if((k[a>>2]&64|0)==0?(k[d>>2]=k[a+60>>2],k[d+4>>2]=21505,k[d+8>>2]=e+12,(Ia(54,d|0)|0)!=0):0)i[a+75>>0]=-1;d=Hc(a,b,c)|0;r=e;return d|0}function Jc(a){a=a|0;var b=0,c=0;b=a+74|0;c=i[b>>0]|0;i[b>>0]=c+255|c;b=k[a>>2]|0;if(!(b&8)){k[a+8>>2]=0;k[a+4>>2]=0;b=k[a+44>>2]|0;k[a+28>>2]=b;k[a+20>>2]=b;k[a+16>>2]=b+(k[a+48>>2]|0);b=0}else{k[a>>2]=b|32;b=-1}return b|0}function Kc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;f=b&255;d=(c|0)!=0;a:do if(d&(a&3|0)!=0){e=b&255;while(1){if((i[a>>0]|0)==e<<24>>24){g=6;break a}a=a+1|0;c=c+-1|0;d=(c|0)!=0;if(!(d&(a&3|0)!=0)){g=5;break}}}else g=5;while(0);if((g|0)==5)if(d)g=6;else c=0;b:do if((g|0)==6){e=b&255;if((i[a>>0]|0)!=e<<24>>24){d=ha(f,16843009)|0;c:do if(c>>>0>3)while(1){f=k[a>>2]^d;if((f&-2139062144^-2139062144)&f+-16843009)break;a=a+4|0;c=c+-4|0;if(c>>>0<=3){g=11;break c}}else g=11;while(0);if((g|0)==11)if(!c){c=0;break}while(1){if((i[a>>0]|0)==e<<24>>24)break b;a=a+1|0;c=c+-1|0;if(!c){c=0;break}}}}while(0);return ((c|0)!=0?a:0)|0}function Lc(a){a=a|0;var b=0,c=0,d=0;d=a;a:do if(!(d&3))c=4;else{b=a;a=d;while(1){if(!(i[b>>0]|0))break a;b=b+1|0;a=b;if(!(a&3)){a=b;c=4;break}}}while(0);if((c|0)==4){while(1){b=k[a>>2]|0;if(!((b&-2139062144^-2139062144)&b+-16843009))a=a+4|0;else break}if((b&255)<<24>>24)do a=a+1|0;while((i[a>>0]|0)!=0)}return a-d|0}function Mc(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,m=0,n=0.0,o=0,q=0,s=0,u=0,v=0.0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0;ga=r;r=r+624|0;ba=ga+24|0;da=ga+16|0;ca=ga+588|0;Y=ga+576|0;aa=ga;V=ga+536|0;fa=ga+8|0;ea=ga+528|0;M=(a|0)!=0;N=V+40|0;U=N;V=V+39|0;W=fa+4|0;X=Y+12|0;Y=Y+11|0;Z=ca;_=X;$=_-Z|0;O=-2-Z|0;P=_+2|0;Q=ba+288|0;R=ca+9|0;S=R;T=ca+8|0;f=0;w=b;g=0;b=0;a:while(1){do if((f|0)>-1)if((g|0)>(2147483647-f|0)){f=nc()|0;k[f>>2]=75;f=-1;break}else{f=g+f|0;break}while(0);g=i[w>>0]|0;if(!(g<<24>>24)){K=245;break}else h=w;b:while(1){switch(g<<24>>24){case 37:{g=h;K=9;break b}case 0:{g=h;break b}default:{}}J=h+1|0;g=i[J>>0]|0;h=J}c:do if((K|0)==9)while(1){K=0;if((i[g+1>>0]|0)!=37)break c;h=h+1|0;g=g+2|0;if((i[g>>0]|0)==37)K=9;else break}while(0);y=h-w|0;if(M?(k[a>>2]&32|0)==0:0)vc(w,y,a)|0;if((h|0)!=(w|0)){w=g;g=y;continue}o=g+1|0;h=i[o>>0]|0;m=(h<<24>>24)+-48|0;if(m>>>0<10){J=(i[g+2>>0]|0)==36;o=J?g+3|0:o;h=i[o>>0]|0;u=J?m:-1;b=J?1:b}else u=-1;g=h<<24>>24;d:do if((g&-32|0)==32){m=0;while(1){if(!(1<<g+-32&75913)){q=m;g=o;break d}m=1<<(h<<24>>24)+-32|m;o=o+1|0;h=i[o>>0]|0;g=h<<24>>24;if((g&-32|0)!=32){q=m;g=o;break}}}else{q=0;g=o}while(0);do if(h<<24>>24==42){m=g+1|0;h=(i[m>>0]|0)+-48|0;if(h>>>0<10?(i[g+2>>0]|0)==36:0){k[e+(h<<2)>>2]=10;b=1;g=g+3|0;h=k[d+((i[m>>0]|0)+-48<<3)>>2]|0}else{if(b){f=-1;break a}if(!M){x=q;g=m;b=0;J=0;break}b=(k[c>>2]|0)+(4-1)&~(4-1);h=k[b>>2]|0;k[c>>2]=b+4;b=0;g=m}if((h|0)<0){x=q|8192;J=0-h|0}else{x=q;J=h}}else{m=(h<<24>>24)+-48|0;if(m>>>0<10){h=0;do{h=(h*10|0)+m|0;g=g+1|0;m=(i[g>>0]|0)+-48|0}while(m>>>0<10);if((h|0)<0){f=-1;break a}else{x=q;J=h}}else{x=q;J=0}}while(0);e:do if((i[g>>0]|0)==46){m=g+1|0;h=i[m>>0]|0;if(h<<24>>24!=42){o=(h<<24>>24)+-48|0;if(o>>>0<10){g=m;h=0}else{g=m;o=0;break}while(1){h=(h*10|0)+o|0;g=g+1|0;o=(i[g>>0]|0)+-48|0;if(o>>>0>=10){o=h;break e}}}m=g+2|0;h=(i[m>>0]|0)+-48|0;if(h>>>0<10?(i[g+3>>0]|0)==36:0){k[e+(h<<2)>>2]=10;g=g+4|0;o=k[d+((i[m>>0]|0)+-48<<3)>>2]|0;break}if(b){f=-1;break a}if(M){g=(k[c>>2]|0)+(4-1)&~(4-1);o=k[g>>2]|0;k[c>>2]=g+4;g=m}else{g=m;o=0}}else o=-1;while(0);s=0;while(1){h=(i[g>>0]|0)+-65|0;if(h>>>0>57){f=-1;break a}m=g+1|0;h=i[5347+(s*58|0)+h>>0]|0;q=h&255;if((q+-1|0)>>>0<8){g=m;s=q}else{I=m;break}}if(!(h<<24>>24)){f=-1;break}m=(u|0)>-1;do if(h<<24>>24==19)if(m){f=-1;break a}else K=52;else{if(m){k[e+(u<<2)>>2]=q;G=d+(u<<3)|0;H=k[G+4>>2]|0;K=aa;k[K>>2]=k[G>>2];k[K+4>>2]=H;K=52;break}if(!M){f=0;break a}Pc(aa,q,c)}while(0);if((K|0)==52?(K=0,!M):0){w=I;g=y;continue}u=i[g>>0]|0;u=(s|0)!=0&(u&15|0)==3?u&-33:u;m=x&-65537;H=(x&8192|0)==0?x:m;f:do switch(u|0){case 110:switch(s|0){case 0:{k[k[aa>>2]>>2]=f;w=I;g=y;continue a}case 1:{k[k[aa>>2]>>2]=f;w=I;g=y;continue a}case 2:{w=k[aa>>2]|0;k[w>>2]=f;k[w+4>>2]=((f|0)<0)<<31>>31;w=I;g=y;continue a}case 3:{j[k[aa>>2]>>1]=f;w=I;g=y;continue a}case 4:{i[k[aa>>2]>>0]=f;w=I;g=y;continue a}case 6:{k[k[aa>>2]>>2]=f;w=I;g=y;continue a}case 7:{w=k[aa>>2]|0;k[w>>2]=f;k[w+4>>2]=((f|0)<0)<<31>>31;w=I;g=y;continue a}default:{w=I;g=y;continue a}}case 112:{s=H|8;o=o>>>0>8?o:8;u=120;K=64;break}case 88:case 120:{s=H;K=64;break}case 111:{m=aa;h=k[m>>2]|0;m=k[m+4>>2]|0;if((h|0)==0&(m|0)==0)g=N;else{g=N;do{g=g+-1|0;i[g>>0]=h&7|48;h=ad(h|0,m|0,3)|0;m=L}while(!((h|0)==0&(m|0)==0))}if(!(H&8)){h=H;s=0;q=5827;K=77}else{s=U-g+1|0;h=H;o=(o|0)<(s|0)?s:o;s=0;q=5827;K=77}break}case 105:case 100:{h=aa;g=k[h>>2]|0;h=k[h+4>>2]|0;if((h|0)<0){g=Zc(0,0,g|0,h|0)|0;h=L;m=aa;k[m>>2]=g;k[m+4>>2]=h;m=1;q=5827;K=76;break f}if(!(H&2048)){q=H&1;m=q;q=(q|0)==0?5827:5829;K=76}else{m=1;q=5828;K=76}break}case 117:{h=aa;g=k[h>>2]|0;h=k[h+4>>2]|0;m=0;q=5827;K=76;break}case 99:{i[V>>0]=k[aa>>2];w=V;h=1;s=0;u=5827;g=N;break}case 109:{g=nc()|0;g=mc(k[g>>2]|0)|0;K=82;break}case 115:{g=k[aa>>2]|0;g=(g|0)!=0?g:5837;K=82;break}case 67:{k[fa>>2]=k[aa>>2];k[W>>2]=0;k[aa>>2]=fa;o=-1;K=86;break}case 83:{if(!o){Rc(a,32,J,0,H);g=0;K=98}else K=86;break}case 65:case 71:case 70:case 69:case 97:case 103:case 102:case 101:{n=+p[aa>>3];k[da>>2]=0;p[t>>3]=n;if((k[t+4>>2]|0)>=0)if(!(H&2048)){G=H&1;F=G;G=(G|0)==0?5845:5850}else{F=1;G=5847}else{n=-n;F=1;G=5844}p[t>>3]=n;E=k[t+4>>2]&2146435072;do if(E>>>0<2146435072|(E|0)==2146435072&0<0){v=+qc(n,da)*2.0;h=v!=0.0;if(h)k[da>>2]=(k[da>>2]|0)+-1;C=u|32;if((C|0)==97){w=u&32;y=(w|0)==0?G:G+9|0;x=F|2;g=12-o|0;do if(!(o>>>0>11|(g|0)==0)){n=8.0;do{g=g+-1|0;n=n*16.0}while((g|0)!=0);if((i[y>>0]|0)==45){n=-(n+(-v-n));break}else{n=v+n-n;break}}else n=v;while(0);h=k[da>>2]|0;g=(h|0)<0?0-h|0:h;g=Qc(g,((g|0)<0)<<31>>31,X)|0;if((g|0)==(X|0)){i[Y>>0]=48;g=Y}i[g+-1>>0]=(h>>31&2)+43;s=g+-2|0;i[s>>0]=u+15;q=(o|0)<1;m=(H&8|0)==0;h=ca;while(1){G=~~n;g=h+1|0;i[h>>0]=l[5811+G>>0]|w;n=(n-+(G|0))*16.0;do if((g-Z|0)==1){if(m&(q&n==0.0))break;i[g>>0]=46;g=h+2|0}while(0);if(!(n!=0.0))break;else h=g}o=(o|0)!=0&(O+g|0)<(o|0)?P+o-s|0:$-s+g|0;m=o+x|0;Rc(a,32,J,m,H);if(!(k[a>>2]&32))vc(y,x,a)|0;Rc(a,48,J,m,H^65536);g=g-Z|0;if(!(k[a>>2]&32))vc(ca,g,a)|0;h=_-s|0;Rc(a,48,o-(g+h)|0,0,0);if(!(k[a>>2]&32))vc(s,h,a)|0;Rc(a,32,J,m,H^8192);g=(m|0)<(J|0)?J:m;break}g=(o|0)<0?6:o;if(h){h=(k[da>>2]|0)+-28|0;k[da>>2]=h;n=v*268435456.0}else{n=v;h=k[da>>2]|0}E=(h|0)<0?ba:Q;D=E;h=E;do{B=~~n>>>0;k[h>>2]=B;h=h+4|0;n=(n-+(B>>>0))*1.0e9}while(n!=0.0);m=h;h=k[da>>2]|0;if((h|0)>0){q=E;while(1){s=(h|0)>29?29:h;o=m+-4|0;do if(o>>>0<q>>>0)o=q;else{h=0;do{B=bd(k[o>>2]|0,0,s|0)|0;B=_c(B|0,L|0,h|0,0)|0;h=L;A=kd(B|0,h|0,1e9,0)|0;k[o>>2]=A;h=jd(B|0,h|0,1e9,0)|0;o=o+-4|0}while(o>>>0>=q>>>0);if(!h){o=q;break}o=q+-4|0;k[o>>2]=h}while(0);while(1){if(m>>>0<=o>>>0)break;h=m+-4|0;if(!(k[h>>2]|0))m=h;else break}h=(k[da>>2]|0)-s|0;k[da>>2]=h;if((h|0)>0)q=o;else break}}else o=E;if((h|0)<0){y=((g+25|0)/9|0)+1|0;z=(C|0)==102;w=o;while(1){x=0-h|0;x=(x|0)>9?9:x;do if(w>>>0<m>>>0){h=(1<<x)+-1|0;q=1e9>>>x;o=0;s=w;do{B=k[s>>2]|0;k[s>>2]=(B>>>x)+o;o=ha(B&h,q)|0;s=s+4|0}while(s>>>0<m>>>0);h=(k[w>>2]|0)==0?w+4|0:w;if(!o){o=h;break}k[m>>2]=o;o=h;m=m+4|0}else o=(k[w>>2]|0)==0?w+4|0:w;while(0);h=z?E:o;m=(m-h>>2|0)>(y|0)?h+(y<<2)|0:m;h=(k[da>>2]|0)+x|0;k[da>>2]=h;if((h|0)>=0){w=o;break}else w=o}}else w=o;do if(w>>>0<m>>>0){h=(D-w>>2)*9|0;q=k[w>>2]|0;if(q>>>0<10)break;else o=10;do{o=o*10|0;h=h+1|0}while(q>>>0>=o>>>0)}else h=0;while(0);A=(C|0)==103;B=(g|0)!=0;o=g-((C|0)!=102?h:0)+((B&A)<<31>>31)|0;if((o|0)<(((m-D>>2)*9|0)+-9|0)){s=o+9216|0;z=(s|0)/9|0;o=E+(z+-1023<<2)|0;s=((s|0)%9|0)+1|0;if((s|0)<9){q=10;do{q=q*10|0;s=s+1|0}while((s|0)!=9)}else q=10;x=k[o>>2]|0;y=(x>>>0)%(q>>>0)|0;if((y|0)==0?(E+(z+-1022<<2)|0)==(m|0):0)q=w;else K=163;do if((K|0)==163){K=0;v=(((x>>>0)/(q>>>0)|0)&1|0)==0?9007199254740992.0:9007199254740994.0;s=(q|0)/2|0;do if(y>>>0<s>>>0)n=.5;else{if((y|0)==(s|0)?(E+(z+-1022<<2)|0)==(m|0):0){n=1.0;break}n=1.5}while(0);do if(F){if((i[G>>0]|0)!=45)break;v=-v;n=-n}while(0);s=x-y|0;k[o>>2]=s;if(!(v+n!=v)){q=w;break}C=s+q|0;k[o>>2]=C;if(C>>>0>999999999){h=w;while(1){q=o+-4|0;k[o>>2]=0;if(q>>>0<h>>>0){h=h+-4|0;k[h>>2]=0}C=(k[q>>2]|0)+1|0;k[q>>2]=C;if(C>>>0>999999999)o=q;else{w=h;o=q;break}}}h=(D-w>>2)*9|0;s=k[w>>2]|0;if(s>>>0<10){q=w;break}else q=10;do{q=q*10|0;h=h+1|0}while(s>>>0>=q>>>0);q=w}while(0);C=o+4|0;w=q;m=m>>>0>C>>>0?C:m}y=0-h|0;while(1){if(m>>>0<=w>>>0){z=0;C=m;break}o=m+-4|0;if(!(k[o>>2]|0))m=o;else{z=1;C=m;break}}do if(A){g=(B&1^1)+g|0;if((g|0)>(h|0)&(h|0)>-5){u=u+-1|0;g=g+-1-h|0}else{u=u+-2|0;g=g+-1|0}m=H&8;if(m)break;do if(z){m=k[C+-4>>2]|0;if(!m){o=9;break}if(!((m>>>0)%10|0)){q=10;o=0}else{o=0;break}do{q=q*10|0;o=o+1|0}while(((m>>>0)%(q>>>0)|0|0)==0)}else o=9;while(0);m=((C-D>>2)*9|0)+-9|0;if((u|32|0)==102){m=m-o|0;m=(m|0)<0?0:m;g=(g|0)<(m|0)?g:m;m=0;break}else{m=m+h-o|0;m=(m|0)<0?0:m;g=(g|0)<(m|0)?g:m;m=0;break}}else m=H&8;while(0);x=g|m;q=(x|0)!=0&1;s=(u|32|0)==102;if(s){h=(h|0)>0?h:0;u=0}else{o=(h|0)<0?y:h;o=Qc(o,((o|0)<0)<<31>>31,X)|0;if((_-o|0)<2)do{o=o+-1|0;i[o>>0]=48}while((_-o|0)<2);i[o+-1>>0]=(h>>31&2)+43;D=o+-2|0;i[D>>0]=u;h=_-D|0;u=D}y=F+1+g+q+h|0;Rc(a,32,J,y,H);if(!(k[a>>2]&32))vc(G,F,a)|0;Rc(a,48,J,y,H^65536);do if(s){o=w>>>0>E>>>0?E:w;h=o;do{m=Qc(k[h>>2]|0,0,R)|0;do if((h|0)==(o|0)){if((m|0)!=(R|0))break;i[T>>0]=48;m=T}else{if(m>>>0<=ca>>>0)break;do{m=m+-1|0;i[m>>0]=48}while(m>>>0>ca>>>0)}while(0);if(!(k[a>>2]&32))vc(m,S-m|0,a)|0;h=h+4|0}while(h>>>0<=E>>>0);do if(x){if(k[a>>2]&32)break;vc(5879,1,a)|0}while(0);if((g|0)>0&h>>>0<C>>>0){m=h;while(1){h=Qc(k[m>>2]|0,0,R)|0;if(h>>>0>ca>>>0)do{h=h+-1|0;i[h>>0]=48}while(h>>>0>ca>>>0);if(!(k[a>>2]&32))vc(h,(g|0)>9?9:g,a)|0;m=m+4|0;h=g+-9|0;if(!((g|0)>9&m>>>0<C>>>0)){g=h;break}else g=h}}Rc(a,48,g+9|0,9,0)}else{s=z?C:w+4|0;if((g|0)>-1){q=(m|0)==0;o=w;do{h=Qc(k[o>>2]|0,0,R)|0;if((h|0)==(R|0)){i[T>>0]=48;h=T}do if((o|0)==(w|0)){m=h+1|0;if(!(k[a>>2]&32))vc(h,1,a)|0;if(q&(g|0)<1){h=m;break}if(k[a>>2]&32){h=m;break}vc(5879,1,a)|0;h=m}else{if(h>>>0<=ca>>>0)break;do{h=h+-1|0;i[h>>0]=48}while(h>>>0>ca>>>0)}while(0);m=S-h|0;if(!(k[a>>2]&32))vc(h,(g|0)>(m|0)?m:g,a)|0;g=g-m|0;o=o+4|0}while(o>>>0<s>>>0&(g|0)>-1)}Rc(a,48,g+18|0,18,0);if(k[a>>2]&32)break;vc(u,_-u|0,a)|0}while(0);Rc(a,32,J,y,H^8192);g=(y|0)<(J|0)?J:y}else{s=(u&32|0)!=0;q=n!=n|0.0!=0.0;h=q?0:F;o=h+3|0;Rc(a,32,J,o,m);g=k[a>>2]|0;if(!(g&32)){vc(G,h,a)|0;g=k[a>>2]|0}if(!(g&32))vc(q?(s?5871:5875):s?5863:5867,3,a)|0;Rc(a,32,J,o,H^8192);g=(o|0)<(J|0)?J:o}while(0);w=I;continue a}default:{m=H;h=o;s=0;u=5827;g=N}}while(0);g:do if((K|0)==64){m=aa;h=k[m>>2]|0;m=k[m+4>>2]|0;q=u&32;if(!((h|0)==0&(m|0)==0)){g=N;do{g=g+-1|0;i[g>>0]=l[5811+(h&15)>>0]|q;h=ad(h|0,m|0,4)|0;m=L}while(!((h|0)==0&(m|0)==0));K=aa;if((s&8|0)==0|(k[K>>2]|0)==0&(k[K+4>>2]|0)==0){h=s;s=0;q=5827;K=77}else{h=s;s=2;q=5827+(u>>4)|0;K=77}}else{g=N;h=s;s=0;q=5827;K=77}}else if((K|0)==76){g=Qc(g,h,N)|0;h=H;s=m;K=77}else if((K|0)==82){K=0;H=Kc(g,0,o)|0;G=(H|0)==0;w=g;h=G?o:H-g|0;s=0;u=5827;g=G?g+o|0:H}else if((K|0)==86){K=0;h=0;g=0;q=k[aa>>2]|0;while(1){m=k[q>>2]|0;if(!m)break;g=sc(ea,m)|0;if((g|0)<0|g>>>0>(o-h|0)>>>0)break;h=g+h|0;if(o>>>0>h>>>0)q=q+4|0;else break}if((g|0)<0){f=-1;break a}Rc(a,32,J,h,H);if(!h){g=0;K=98}else{m=0;o=k[aa>>2]|0;while(1){g=k[o>>2]|0;if(!g){g=h;K=98;break g}g=sc(ea,g)|0;m=g+m|0;if((m|0)>(h|0)){g=h;K=98;break g}if(!(k[a>>2]&32))vc(ea,g,a)|0;if(m>>>0>=h>>>0){g=h;K=98;break}else o=o+4|0}}}while(0);if((K|0)==98){K=0;Rc(a,32,J,g,H^8192);w=I;g=(J|0)>(g|0)?J:g;continue}if((K|0)==77){K=0;m=(o|0)>-1?h&-65537:h;h=aa;h=(k[h>>2]|0)!=0|(k[h+4>>2]|0)!=0;if((o|0)!=0|h){h=(h&1^1)+(U-g)|0;w=g;h=(o|0)>(h|0)?o:h;u=q;g=N}else{w=N;h=0;u=q;g=N}}q=g-w|0;h=(h|0)<(q|0)?q:h;o=s+h|0;g=(J|0)<(o|0)?o:J;Rc(a,32,g,o,m);if(!(k[a>>2]&32))vc(u,s,a)|0;Rc(a,48,g,o,m^65536);Rc(a,48,h,q,0);if(!(k[a>>2]&32))vc(w,q,a)|0;Rc(a,32,g,o,m^8192);w=I}h:do if((K|0)==245)if(!a)if(b){f=1;while(1){b=k[e+(f<<2)>>2]|0;if(!b)break;Pc(d+(f<<3)|0,b,c);f=f+1|0;if((f|0)>=10){f=1;break h}}if((f|0)<10)while(1){if(k[e+(f<<2)>>2]|0){f=-1;break h}f=f+1|0;if((f|0)>=10){f=1;break}}else f=1}else f=0;while(0);r=ga;return f|0}function Nc(a){a=a|0;if(!(k[a+68>>2]|0))Dc(a);return}function Oc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=a+20|0;e=k[d>>2]|0;a=(k[a+16>>2]|0)-e|0;a=a>>>0>c>>>0?c:a;cd(e|0,b|0,a|0)|0;k[d>>2]=(k[d>>2]|0)+a;return c|0}function Pc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0.0;a:do if(b>>>0<=20)do switch(b|0){case 9:{d=(k[c>>2]|0)+(4-1)&~(4-1);b=k[d>>2]|0;k[c>>2]=d+4;k[a>>2]=b;break a}case 10:{d=(k[c>>2]|0)+(4-1)&~(4-1);b=k[d>>2]|0;k[c>>2]=d+4;d=a;k[d>>2]=b;k[d+4>>2]=((b|0)<0)<<31>>31;break a}case 11:{d=(k[c>>2]|0)+(4-1)&~(4-1);b=k[d>>2]|0;k[c>>2]=d+4;d=a;k[d>>2]=b;k[d+4>>2]=0;break a}case 12:{d=(k[c>>2]|0)+(8-1)&~(8-1);b=d;e=k[b>>2]|0;b=k[b+4>>2]|0;k[c>>2]=d+8;d=a;k[d>>2]=e;k[d+4>>2]=b;break a}case 13:{e=(k[c>>2]|0)+(4-1)&~(4-1);d=k[e>>2]|0;k[c>>2]=e+4;d=(d&65535)<<16>>16;e=a;k[e>>2]=d;k[e+4>>2]=((d|0)<0)<<31>>31;break a}case 14:{e=(k[c>>2]|0)+(4-1)&~(4-1);d=k[e>>2]|0;k[c>>2]=e+4;e=a;k[e>>2]=d&65535;k[e+4>>2]=0;break a}case 15:{e=(k[c>>2]|0)+(4-1)&~(4-1);d=k[e>>2]|0;k[c>>2]=e+4;d=(d&255)<<24>>24;e=a;k[e>>2]=d;k[e+4>>2]=((d|0)<0)<<31>>31;break a}case 16:{e=(k[c>>2]|0)+(4-1)&~(4-1);d=k[e>>2]|0;k[c>>2]=e+4;e=a;k[e>>2]=d&255;k[e+4>>2]=0;break a}case 17:{e=(k[c>>2]|0)+(8-1)&~(8-1);f=+p[e>>3];k[c>>2]=e+8;p[a>>3]=f;break a}case 18:{e=(k[c>>2]|0)+(8-1)&~(8-1);f=+p[e>>3];k[c>>2]=e+8;p[a>>3]=f;break a}default:break a}while(0);while(0);return}function Qc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if(b>>>0>0|(b|0)==0&a>>>0>4294967295)while(1){d=kd(a|0,b|0,10,0)|0;c=c+-1|0;i[c>>0]=d|48;d=jd(a|0,b|0,10,0)|0;if(b>>>0>9|(b|0)==9&a>>>0>4294967295){a=d;b=L}else{a=d;break}}if(a)while(1){c=c+-1|0;i[c>>0]=(a>>>0)%10|0|48;if(a>>>0<10)break;else a=(a>>>0)/10|0}return c|0}function Rc(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0;h=r;r=r+256|0;g=h;do if((c|0)>(d|0)&(e&73728|0)==0){e=c-d|0;$c(g|0,b|0,(e>>>0>256?256:e)|0)|0;b=k[a>>2]|0;f=(b&32|0)==0;if(e>>>0>255){d=c-d|0;do{if(f){vc(g,256,a)|0;b=k[a>>2]|0}e=e+-256|0;f=(b&32|0)==0}while(e>>>0>255);if(f)e=d&255;else break}else if(!f)break;vc(g,e,a)|0}while(0);r=h;return}function Sc(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;do if(a>>>0<245){o=a>>>0<11?16:a+11&-8;a=o>>>3;h=k[147]|0;c=h>>>a;if(c&3){a=(c&1^1)+a|0;d=a<<1;c=628+(d<<2)|0;d=628+(d+2<<2)|0;e=k[d>>2]|0;f=e+8|0;g=k[f>>2]|0;do if((c|0)!=(g|0)){if(g>>>0<(k[151]|0)>>>0)Aa();b=g+12|0;if((k[b>>2]|0)==(e|0)){k[b>>2]=c;k[d>>2]=g;break}else Aa()}else k[147]=h&~(1<<a);while(0);M=a<<3;k[e+4>>2]=M|3;M=e+(M|4)|0;k[M>>2]=k[M>>2]|1;M=f;return M|0}g=k[149]|0;if(o>>>0>g>>>0){if(c){d=2<<a;d=c<<a&(d|0-d);d=(d&0-d)+-1|0;i=d>>>12&16;d=d>>>i;e=d>>>5&8;d=d>>>e;f=d>>>2&4;d=d>>>f;c=d>>>1&2;d=d>>>c;a=d>>>1&1;a=(e|i|f|c|a)+(d>>>a)|0;d=a<<1;c=628+(d<<2)|0;d=628+(d+2<<2)|0;f=k[d>>2]|0;i=f+8|0;e=k[i>>2]|0;do if((c|0)!=(e|0)){if(e>>>0<(k[151]|0)>>>0)Aa();b=e+12|0;if((k[b>>2]|0)==(f|0)){k[b>>2]=c;k[d>>2]=e;j=k[149]|0;break}else Aa()}else{k[147]=h&~(1<<a);j=g}while(0);M=a<<3;g=M-o|0;k[f+4>>2]=o|3;h=f+o|0;k[f+(o|4)>>2]=g|1;k[f+M>>2]=g;if(j){e=k[152]|0;c=j>>>3;b=c<<1;d=628+(b<<2)|0;a=k[147]|0;c=1<<c;if(a&c){a=628+(b+2<<2)|0;b=k[a>>2]|0;if(b>>>0<(k[151]|0)>>>0)Aa();else{l=a;m=b}}else{k[147]=a|c;l=628+(b+2<<2)|0;m=d}k[l>>2]=e;k[m+12>>2]=e;k[e+8>>2]=m;k[e+12>>2]=d}k[149]=g;k[152]=h;M=i;return M|0}a=k[148]|0;if(a){c=(a&0-a)+-1|0;L=c>>>12&16;c=c>>>L;K=c>>>5&8;c=c>>>K;M=c>>>2&4;c=c>>>M;a=c>>>1&2;c=c>>>a;d=c>>>1&1;d=k[892+((K|L|M|a|d)+(c>>>d)<<2)>>2]|0;c=(k[d+4>>2]&-8)-o|0;a=d;while(1){b=k[a+16>>2]|0;if(!b){b=k[a+20>>2]|0;if(!b){i=c;break}}a=(k[b+4>>2]&-8)-o|0;M=a>>>0<c>>>0;c=M?a:c;a=b;d=M?b:d}f=k[151]|0;if(d>>>0<f>>>0)Aa();h=d+o|0;if(d>>>0>=h>>>0)Aa();g=k[d+24>>2]|0;c=k[d+12>>2]|0;do if((c|0)==(d|0)){a=d+20|0;b=k[a>>2]|0;if(!b){a=d+16|0;b=k[a>>2]|0;if(!b){n=0;break}}while(1){c=b+20|0;e=k[c>>2]|0;if(e){b=e;a=c;continue}c=b+16|0;e=k[c>>2]|0;if(!e)break;else{b=e;a=c}}if(a>>>0<f>>>0)Aa();else{k[a>>2]=0;n=b;break}}else{e=k[d+8>>2]|0;if(e>>>0<f>>>0)Aa();b=e+12|0;if((k[b>>2]|0)!=(d|0))Aa();a=c+8|0;if((k[a>>2]|0)==(d|0)){k[b>>2]=c;k[a>>2]=e;n=c;break}else Aa()}while(0);do if(g){b=k[d+28>>2]|0;a=892+(b<<2)|0;if((d|0)==(k[a>>2]|0)){k[a>>2]=n;if(!n){k[148]=k[148]&~(1<<b);break}}else{if(g>>>0<(k[151]|0)>>>0)Aa();b=g+16|0;if((k[b>>2]|0)==(d|0))k[b>>2]=n;else k[g+20>>2]=n;if(!n)break}a=k[151]|0;if(n>>>0<a>>>0)Aa();k[n+24>>2]=g;b=k[d+16>>2]|0;do if(b)if(b>>>0<a>>>0)Aa();else{k[n+16>>2]=b;k[b+24>>2]=n;break}while(0);b=k[d+20>>2]|0;if(b)if(b>>>0<(k[151]|0)>>>0)Aa();else{k[n+20>>2]=b;k[b+24>>2]=n;break}}while(0);if(i>>>0<16){M=i+o|0;k[d+4>>2]=M|3;M=d+(M+4)|0;k[M>>2]=k[M>>2]|1}else{k[d+4>>2]=o|3;k[d+(o|4)>>2]=i|1;k[d+(i+o)>>2]=i;b=k[149]|0;if(b){f=k[152]|0;c=b>>>3;b=c<<1;e=628+(b<<2)|0;a=k[147]|0;c=1<<c;if(a&c){b=628+(b+2<<2)|0;a=k[b>>2]|0;if(a>>>0<(k[151]|0)>>>0)Aa();else{p=b;q=a}}else{k[147]=a|c;p=628+(b+2<<2)|0;q=e}k[p>>2]=f;k[q+12>>2]=f;k[f+8>>2]=q;k[f+12>>2]=e}k[149]=i;k[152]=h}M=d+8|0;return M|0}else q=o}else q=o}else if(a>>>0<=4294967231){a=a+11|0;m=a&-8;l=k[148]|0;if(l){c=0-m|0;a=a>>>8;if(a)if(m>>>0>16777215)j=31;else{q=(a+1048320|0)>>>16&8;v=a<<q;p=(v+520192|0)>>>16&4;v=v<<p;j=(v+245760|0)>>>16&2;j=14-(p|q|j)+(v<<j>>>15)|0;j=m>>>(j+7|0)&1|j<<1}else j=0;a=k[892+(j<<2)>>2]|0;a:do if(!a){e=0;a=0;v=86}else{g=c;e=0;h=m<<((j|0)==31?0:25-(j>>>1)|0);i=a;a=0;while(1){f=k[i+4>>2]&-8;c=f-m|0;if(c>>>0<g>>>0)if((f|0)==(m|0)){f=i;a=i;v=90;break a}else a=i;else c=g;v=k[i+20>>2]|0;i=k[i+16+(h>>>31<<2)>>2]|0;e=(v|0)==0|(v|0)==(i|0)?e:v;if(!i){v=86;break}else{g=c;h=h<<1}}}while(0);if((v|0)==86){if((e|0)==0&(a|0)==0){a=2<<j;a=l&(a|0-a);if(!a){q=m;break}a=(a&0-a)+-1|0;n=a>>>12&16;a=a>>>n;l=a>>>5&8;a=a>>>l;p=a>>>2&4;a=a>>>p;q=a>>>1&2;a=a>>>q;e=a>>>1&1;e=k[892+((l|n|p|q|e)+(a>>>e)<<2)>>2]|0;a=0}if(!e){h=c;i=a}else{f=e;v=90}}if((v|0)==90)while(1){v=0;q=(k[f+4>>2]&-8)-m|0;e=q>>>0<c>>>0;c=e?q:c;a=e?f:a;e=k[f+16>>2]|0;if(e){f=e;v=90;continue}f=k[f+20>>2]|0;if(!f){h=c;i=a;break}else v=90}if((i|0)!=0?h>>>0<((k[149]|0)-m|0)>>>0:0){e=k[151]|0;if(i>>>0<e>>>0)Aa();g=i+m|0;if(i>>>0>=g>>>0)Aa();f=k[i+24>>2]|0;c=k[i+12>>2]|0;do if((c|0)==(i|0)){a=i+20|0;b=k[a>>2]|0;if(!b){a=i+16|0;b=k[a>>2]|0;if(!b){o=0;break}}while(1){c=b+20|0;d=k[c>>2]|0;if(d){b=d;a=c;continue}c=b+16|0;d=k[c>>2]|0;if(!d)break;else{b=d;a=c}}if(a>>>0<e>>>0)Aa();else{k[a>>2]=0;o=b;break}}else{d=k[i+8>>2]|0;if(d>>>0<e>>>0)Aa();b=d+12|0;if((k[b>>2]|0)!=(i|0))Aa();a=c+8|0;if((k[a>>2]|0)==(i|0)){k[b>>2]=c;k[a>>2]=d;o=c;break}else Aa()}while(0);do if(f){b=k[i+28>>2]|0;a=892+(b<<2)|0;if((i|0)==(k[a>>2]|0)){k[a>>2]=o;if(!o){k[148]=k[148]&~(1<<b);break}}else{if(f>>>0<(k[151]|0)>>>0)Aa();b=f+16|0;if((k[b>>2]|0)==(i|0))k[b>>2]=o;else k[f+20>>2]=o;if(!o)break}a=k[151]|0;if(o>>>0<a>>>0)Aa();k[o+24>>2]=f;b=k[i+16>>2]|0;do if(b)if(b>>>0<a>>>0)Aa();else{k[o+16>>2]=b;k[b+24>>2]=o;break}while(0);b=k[i+20>>2]|0;if(b)if(b>>>0<(k[151]|0)>>>0)Aa();else{k[o+20>>2]=b;k[b+24>>2]=o;break}}while(0);b:do if(h>>>0>=16){k[i+4>>2]=m|3;k[i+(m|4)>>2]=h|1;k[i+(h+m)>>2]=h;b=h>>>3;if(h>>>0<256){a=b<<1;d=628+(a<<2)|0;c=k[147]|0;b=1<<b;if(c&b){b=628+(a+2<<2)|0;a=k[b>>2]|0;if(a>>>0<(k[151]|0)>>>0)Aa();else{s=b;t=a}}else{k[147]=c|b;s=628+(a+2<<2)|0;t=d}k[s>>2]=g;k[t+12>>2]=g;k[i+(m+8)>>2]=t;k[i+(m+12)>>2]=d;break}b=h>>>8;if(b)if(h>>>0>16777215)d=31;else{L=(b+1048320|0)>>>16&8;M=b<<L;K=(M+520192|0)>>>16&4;M=M<<K;d=(M+245760|0)>>>16&2;d=14-(K|L|d)+(M<<d>>>15)|0;d=h>>>(d+7|0)&1|d<<1}else d=0;b=892+(d<<2)|0;k[i+(m+28)>>2]=d;k[i+(m+20)>>2]=0;k[i+(m+16)>>2]=0;a=k[148]|0;c=1<<d;if(!(a&c)){k[148]=a|c;k[b>>2]=g;k[i+(m+24)>>2]=b;k[i+(m+12)>>2]=g;k[i+(m+8)>>2]=g;break}b=k[b>>2]|0;c:do if((k[b+4>>2]&-8|0)!=(h|0)){d=h<<((d|0)==31?0:25-(d>>>1)|0);while(1){a=b+16+(d>>>31<<2)|0;c=k[a>>2]|0;if(!c)break;if((k[c+4>>2]&-8|0)==(h|0)){y=c;break c}else{d=d<<1;b=c}}if(a>>>0<(k[151]|0)>>>0)Aa();else{k[a>>2]=g;k[i+(m+24)>>2]=b;k[i+(m+12)>>2]=g;k[i+(m+8)>>2]=g;break b}}else y=b;while(0);b=y+8|0;a=k[b>>2]|0;M=k[151]|0;if(a>>>0>=M>>>0&y>>>0>=M>>>0){k[a+12>>2]=g;k[b>>2]=g;k[i+(m+8)>>2]=a;k[i+(m+12)>>2]=y;k[i+(m+24)>>2]=0;break}else Aa()}else{M=h+m|0;k[i+4>>2]=M|3;M=i+(M+4)|0;k[M>>2]=k[M>>2]|1}while(0);M=i+8|0;return M|0}else q=m}else q=m}else q=-1;while(0);c=k[149]|0;if(c>>>0>=q>>>0){b=c-q|0;a=k[152]|0;if(b>>>0>15){k[152]=a+q;k[149]=b;k[a+(q+4)>>2]=b|1;k[a+c>>2]=b;k[a+4>>2]=q|3}else{k[149]=0;k[152]=0;k[a+4>>2]=c|3;M=a+(c+4)|0;k[M>>2]=k[M>>2]|1}M=a+8|0;return M|0}a=k[150]|0;if(a>>>0>q>>>0){L=a-q|0;k[150]=L;M=k[153]|0;k[153]=M+q;k[M+(q+4)>>2]=L|1;k[M+4>>2]=q|3;M=M+8|0;return M|0}do if(!(k[265]|0)){a=Ma(30)|0;if(!(a+-1&a)){k[267]=a;k[266]=a;k[268]=-1;k[269]=-1;k[270]=0;k[258]=0;y=(Ea(0)|0)&-16^1431655768;k[265]=y;break}else Aa()}while(0);i=q+48|0;h=k[267]|0;j=q+47|0;g=h+j|0;h=0-h|0;l=g&h;if(l>>>0<=q>>>0){M=0;return M|0}a=k[257]|0;if((a|0)!=0?(t=k[255]|0,y=t+l|0,y>>>0<=t>>>0|y>>>0>a>>>0):0){M=0;return M|0}d:do if(!(k[258]&4)){a=k[153]|0;e:do if(a){e=1036;while(1){c=k[e>>2]|0;if(c>>>0<=a>>>0?(r=e+4|0,(c+(k[r>>2]|0)|0)>>>0>a>>>0):0){f=e;a=r;break}e=k[e+8>>2]|0;if(!e){v=174;break e}}c=g-(k[150]|0)&h;if(c>>>0<2147483647){e=Da(c|0)|0;y=(e|0)==((k[f>>2]|0)+(k[a>>2]|0)|0);a=y?c:0;if(y){if((e|0)!=(-1|0)){w=e;p=a;v=194;break d}}else v=184}else a=0}else v=174;while(0);do if((v|0)==174){f=Da(0)|0;if((f|0)!=(-1|0)){a=f;c=k[266]|0;e=c+-1|0;if(!(e&a))c=l;else c=l-a+(e+a&0-c)|0;a=k[255]|0;e=a+c|0;if(c>>>0>q>>>0&c>>>0<2147483647){y=k[257]|0;if((y|0)!=0?e>>>0<=a>>>0|e>>>0>y>>>0:0){a=0;break}e=Da(c|0)|0;y=(e|0)==(f|0);a=y?c:0;if(y){w=f;p=a;v=194;break d}else v=184}else a=0}else a=0}while(0);f:do if((v|0)==184){f=0-c|0;do if(i>>>0>c>>>0&(c>>>0<2147483647&(e|0)!=(-1|0))?(u=k[267]|0,u=j-c+u&0-u,u>>>0<2147483647):0)if((Da(u|0)|0)==(-1|0)){Da(f|0)|0;break f}else{c=u+c|0;break}while(0);if((e|0)!=(-1|0)){w=e;p=c;v=194;break d}}while(0);k[258]=k[258]|4;v=191}else{a=0;v=191}while(0);if((((v|0)==191?l>>>0<2147483647:0)?(w=Da(l|0)|0,x=Da(0)|0,w>>>0<x>>>0&((w|0)!=(-1|0)&(x|0)!=(-1|0))):0)?(z=x-w|0,A=z>>>0>(q+40|0)>>>0,A):0){p=A?z:a;v=194}if((v|0)==194){a=(k[255]|0)+p|0;k[255]=a;if(a>>>0>(k[256]|0)>>>0)k[256]=a;g=k[153]|0;g:do if(g){f=1036;do{a=k[f>>2]|0;c=f+4|0;e=k[c>>2]|0;if((w|0)==(a+e|0)){B=a;C=c;D=e;E=f;v=204;break}f=k[f+8>>2]|0}while((f|0)!=0);if(((v|0)==204?(k[E+12>>2]&8|0)==0:0)?g>>>0<w>>>0&g>>>0>=B>>>0:0){k[C>>2]=D+p;M=(k[150]|0)+p|0;L=g+8|0;L=(L&7|0)==0?0:0-L&7;K=M-L|0;k[153]=g+L;k[150]=K;k[g+(L+4)>>2]=K|1;k[g+(M+4)>>2]=40;k[154]=k[269];break}a=k[151]|0;if(w>>>0<a>>>0){k[151]=w;a=w}c=w+p|0;f=1036;while(1){if((k[f>>2]|0)==(c|0)){e=f;c=f;v=212;break}f=k[f+8>>2]|0;if(!f){c=1036;break}}if((v|0)==212)if(!(k[c+12>>2]&8)){k[e>>2]=w;n=c+4|0;k[n>>2]=(k[n>>2]|0)+p;n=w+8|0;n=(n&7|0)==0?0:0-n&7;j=w+(p+8)|0;j=(j&7|0)==0?0:0-j&7;b=w+(j+p)|0;m=n+q|0;o=w+m|0;l=b-(w+n)-q|0;k[w+(n+4)>>2]=q|3;h:do if((b|0)!=(g|0)){if((b|0)==(k[152]|0)){M=(k[149]|0)+l|0;k[149]=M;k[152]=o;k[w+(m+4)>>2]=M|1;k[w+(M+m)>>2]=M;break}h=p+4|0;c=k[w+(h+j)>>2]|0;if((c&3|0)==1){i=c&-8;f=c>>>3;i:do if(c>>>0>=256){g=k[w+((j|24)+p)>>2]|0;d=k[w+(p+12+j)>>2]|0;do if((d|0)==(b|0)){e=j|16;d=w+(h+e)|0;c=k[d>>2]|0;if(!c){d=w+(e+p)|0;c=k[d>>2]|0;if(!c){J=0;break}}while(1){e=c+20|0;f=k[e>>2]|0;if(f){c=f;d=e;continue}e=c+16|0;f=k[e>>2]|0;if(!f)break;else{c=f;d=e}}if(d>>>0<a>>>0)Aa();else{k[d>>2]=0;J=c;break}}else{e=k[w+((j|8)+p)>>2]|0;if(e>>>0<a>>>0)Aa();a=e+12|0;if((k[a>>2]|0)!=(b|0))Aa();c=d+8|0;if((k[c>>2]|0)==(b|0)){k[a>>2]=d;k[c>>2]=e;J=d;break}else Aa()}while(0);if(!g)break;a=k[w+(p+28+j)>>2]|0;c=892+(a<<2)|0;do if((b|0)!=(k[c>>2]|0)){if(g>>>0<(k[151]|0)>>>0)Aa();a=g+16|0;if((k[a>>2]|0)==(b|0))k[a>>2]=J;else k[g+20>>2]=J;if(!J)break i}else{k[c>>2]=J;if(J)break;k[148]=k[148]&~(1<<a);break i}while(0);c=k[151]|0;if(J>>>0<c>>>0)Aa();k[J+24>>2]=g;b=j|16;a=k[w+(b+p)>>2]|0;do if(a)if(a>>>0<c>>>0)Aa();else{k[J+16>>2]=a;k[a+24>>2]=J;break}while(0);b=k[w+(h+b)>>2]|0;if(!b)break;if(b>>>0<(k[151]|0)>>>0)Aa();else{k[J+20>>2]=b;k[b+24>>2]=J;break}}else{d=k[w+((j|8)+p)>>2]|0;e=k[w+(p+12+j)>>2]|0;c=628+(f<<1<<2)|0;do if((d|0)!=(c|0)){if(d>>>0<a>>>0)Aa();if((k[d+12>>2]|0)==(b|0))break;Aa()}while(0);if((e|0)==(d|0)){k[147]=k[147]&~(1<<f);break}do if((e|0)==(c|0))F=e+8|0;else{if(e>>>0<a>>>0)Aa();a=e+8|0;if((k[a>>2]|0)==(b|0)){F=a;break}Aa()}while(0);k[d+12>>2]=e;k[F>>2]=d}while(0);b=w+((i|j)+p)|0;e=i+l|0}else e=l;b=b+4|0;k[b>>2]=k[b>>2]&-2;k[w+(m+4)>>2]=e|1;k[w+(e+m)>>2]=e;b=e>>>3;if(e>>>0<256){a=b<<1;d=628+(a<<2)|0;c=k[147]|0;b=1<<b;do if(!(c&b)){k[147]=c|b;K=628+(a+2<<2)|0;L=d}else{b=628+(a+2<<2)|0;a=k[b>>2]|0;if(a>>>0>=(k[151]|0)>>>0){K=b;L=a;break}Aa()}while(0);k[K>>2]=o;k[L+12>>2]=o;k[w+(m+8)>>2]=L;k[w+(m+12)>>2]=d;break}b=e>>>8;do if(!b)d=0;else{if(e>>>0>16777215){d=31;break}K=(b+1048320|0)>>>16&8;L=b<<K;J=(L+520192|0)>>>16&4;L=L<<J;d=(L+245760|0)>>>16&2;d=14-(J|K|d)+(L<<d>>>15)|0;d=e>>>(d+7|0)&1|d<<1}while(0);b=892+(d<<2)|0;k[w+(m+28)>>2]=d;k[w+(m+20)>>2]=0;k[w+(m+16)>>2]=0;a=k[148]|0;c=1<<d;if(!(a&c)){k[148]=a|c;k[b>>2]=o;k[w+(m+24)>>2]=b;k[w+(m+12)>>2]=o;k[w+(m+8)>>2]=o;break}b=k[b>>2]|0;j:do if((k[b+4>>2]&-8|0)!=(e|0)){d=e<<((d|0)==31?0:25-(d>>>1)|0);while(1){a=b+16+(d>>>31<<2)|0;c=k[a>>2]|0;if(!c)break;if((k[c+4>>2]&-8|0)==(e|0)){M=c;break j}else{d=d<<1;b=c}}if(a>>>0<(k[151]|0)>>>0)Aa();else{k[a>>2]=o;k[w+(m+24)>>2]=b;k[w+(m+12)>>2]=o;k[w+(m+8)>>2]=o;break h}}else M=b;while(0);b=M+8|0;a=k[b>>2]|0;L=k[151]|0;if(a>>>0>=L>>>0&M>>>0>=L>>>0){k[a+12>>2]=o;k[b>>2]=o;k[w+(m+8)>>2]=a;k[w+(m+12)>>2]=M;k[w+(m+24)>>2]=0;break}else Aa()}else{M=(k[150]|0)+l|0;k[150]=M;k[153]=o;k[w+(m+4)>>2]=M|1}while(0);M=w+(n|8)|0;return M|0}else c=1036;while(1){a=k[c>>2]|0;if(a>>>0<=g>>>0?(b=k[c+4>>2]|0,d=a+b|0,d>>>0>g>>>0):0)break;c=k[c+8>>2]|0}e=a+(b+-39)|0;a=a+(b+-47+((e&7|0)==0?0:0-e&7))|0;e=g+16|0;a=a>>>0<e>>>0?g:a;b=a+8|0;c=w+8|0;c=(c&7|0)==0?0:0-c&7;M=p+-40-c|0;k[153]=w+c;k[150]=M;k[w+(c+4)>>2]=M|1;k[w+(p+-36)>>2]=40;k[154]=k[269];c=a+4|0;k[c>>2]=27;k[b>>2]=k[259];k[b+4>>2]=k[260];k[b+8>>2]=k[261];k[b+12>>2]=k[262];k[259]=w;k[260]=p;k[262]=0;k[261]=b;b=a+28|0;k[b>>2]=7;if((a+32|0)>>>0<d>>>0)do{M=b;b=b+4|0;k[b>>2]=7}while((M+8|0)>>>0<d>>>0);if((a|0)!=(g|0)){f=a-g|0;k[c>>2]=k[c>>2]&-2;k[g+4>>2]=f|1;k[a>>2]=f;b=f>>>3;if(f>>>0<256){a=b<<1;d=628+(a<<2)|0;c=k[147]|0;b=1<<b;if(c&b){b=628+(a+2<<2)|0;a=k[b>>2]|0;if(a>>>0<(k[151]|0)>>>0)Aa();else{G=b;H=a}}else{k[147]=c|b;G=628+(a+2<<2)|0;H=d}k[G>>2]=g;k[H+12>>2]=g;k[g+8>>2]=H;k[g+12>>2]=d;break}b=f>>>8;if(b)if(f>>>0>16777215)d=31;else{L=(b+1048320|0)>>>16&8;M=b<<L;K=(M+520192|0)>>>16&4;M=M<<K;d=(M+245760|0)>>>16&2;d=14-(K|L|d)+(M<<d>>>15)|0;d=f>>>(d+7|0)&1|d<<1}else d=0;c=892+(d<<2)|0;k[g+28>>2]=d;k[g+20>>2]=0;k[e>>2]=0;b=k[148]|0;a=1<<d;if(!(b&a)){k[148]=b|a;k[c>>2]=g;k[g+24>>2]=c;k[g+12>>2]=g;k[g+8>>2]=g;break}b=k[c>>2]|0;k:do if((k[b+4>>2]&-8|0)!=(f|0)){d=f<<((d|0)==31?0:25-(d>>>1)|0);while(1){a=b+16+(d>>>31<<2)|0;c=k[a>>2]|0;if(!c)break;if((k[c+4>>2]&-8|0)==(f|0)){I=c;break k}else{d=d<<1;b=c}}if(a>>>0<(k[151]|0)>>>0)Aa();else{k[a>>2]=g;k[g+24>>2]=b;k[g+12>>2]=g;k[g+8>>2]=g;break g}}else I=b;while(0);b=I+8|0;a=k[b>>2]|0;M=k[151]|0;if(a>>>0>=M>>>0&I>>>0>=M>>>0){k[a+12>>2]=g;k[b>>2]=g;k[g+8>>2]=a;k[g+12>>2]=I;k[g+24>>2]=0;break}else Aa()}}else{M=k[151]|0;if((M|0)==0|w>>>0<M>>>0)k[151]=w;k[259]=w;k[260]=p;k[262]=0;k[156]=k[265];k[155]=-1;b=0;do{M=b<<1;L=628+(M<<2)|0;k[628+(M+3<<2)>>2]=L;k[628+(M+2<<2)>>2]=L;b=b+1|0}while((b|0)!=32);M=w+8|0;M=(M&7|0)==0?0:0-M&7;L=p+-40-M|0;k[153]=w+M;k[150]=L;k[w+(M+4)>>2]=L|1;k[w+(p+-36)>>2]=40;k[154]=k[269]}while(0);b=k[150]|0;if(b>>>0>q>>>0){L=b-q|0;k[150]=L;M=k[153]|0;k[153]=M+q;k[M+(q+4)>>2]=L|1;k[M+4>>2]=q|3;M=M+8|0;return M|0}}M=nc()|0;k[M>>2]=12;M=0;return M|0}function Tc(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;if(!a)return;b=a+-8|0;h=k[151]|0;if(b>>>0<h>>>0)Aa();c=k[a+-4>>2]|0;d=c&3;if((d|0)==1)Aa();o=c&-8;q=a+(o+-8)|0;do if(!(c&1)){b=k[b>>2]|0;if(!d)return;i=-8-b|0;l=a+i|0;m=b+o|0;if(l>>>0<h>>>0)Aa();if((l|0)==(k[152]|0)){b=a+(o+-4)|0;c=k[b>>2]|0;if((c&3|0)!=3){u=l;f=m;break}k[149]=m;k[b>>2]=c&-2;k[a+(i+4)>>2]=m|1;k[q>>2]=m;return}e=b>>>3;if(b>>>0<256){d=k[a+(i+8)>>2]|0;c=k[a+(i+12)>>2]|0;b=628+(e<<1<<2)|0;if((d|0)!=(b|0)){if(d>>>0<h>>>0)Aa();if((k[d+12>>2]|0)!=(l|0))Aa()}if((c|0)==(d|0)){k[147]=k[147]&~(1<<e);u=l;f=m;break}if((c|0)!=(b|0)){if(c>>>0<h>>>0)Aa();b=c+8|0;if((k[b>>2]|0)==(l|0))g=b;else Aa()}else g=c+8|0;k[d+12>>2]=c;k[g>>2]=d;u=l;f=m;break}g=k[a+(i+24)>>2]|0;d=k[a+(i+12)>>2]|0;do if((d|0)==(l|0)){c=a+(i+20)|0;b=k[c>>2]|0;if(!b){c=a+(i+16)|0;b=k[c>>2]|0;if(!b){j=0;break}}while(1){d=b+20|0;e=k[d>>2]|0;if(e){b=e;c=d;continue}d=b+16|0;e=k[d>>2]|0;if(!e)break;else{b=e;c=d}}if(c>>>0<h>>>0)Aa();else{k[c>>2]=0;j=b;break}}else{e=k[a+(i+8)>>2]|0;if(e>>>0<h>>>0)Aa();b=e+12|0;if((k[b>>2]|0)!=(l|0))Aa();c=d+8|0;if((k[c>>2]|0)==(l|0)){k[b>>2]=d;k[c>>2]=e;j=d;break}else Aa()}while(0);if(g){b=k[a+(i+28)>>2]|0;c=892+(b<<2)|0;if((l|0)==(k[c>>2]|0)){k[c>>2]=j;if(!j){k[148]=k[148]&~(1<<b);u=l;f=m;break}}else{if(g>>>0<(k[151]|0)>>>0)Aa();b=g+16|0;if((k[b>>2]|0)==(l|0))k[b>>2]=j;else k[g+20>>2]=j;if(!j){u=l;f=m;break}}c=k[151]|0;if(j>>>0<c>>>0)Aa();k[j+24>>2]=g;b=k[a+(i+16)>>2]|0;do if(b)if(b>>>0<c>>>0)Aa();else{k[j+16>>2]=b;k[b+24>>2]=j;break}while(0);b=k[a+(i+20)>>2]|0;if(b)if(b>>>0<(k[151]|0)>>>0)Aa();else{k[j+20>>2]=b;k[b+24>>2]=j;u=l;f=m;break}else{u=l;f=m}}else{u=l;f=m}}else{u=b;f=o}while(0);if(u>>>0>=q>>>0)Aa();b=a+(o+-4)|0;c=k[b>>2]|0;if(!(c&1))Aa();if(!(c&2)){if((q|0)==(k[153]|0)){t=(k[150]|0)+f|0;k[150]=t;k[153]=u;k[u+4>>2]=t|1;if((u|0)!=(k[152]|0))return;k[152]=0;k[149]=0;return}if((q|0)==(k[152]|0)){t=(k[149]|0)+f|0;k[149]=t;k[152]=u;k[u+4>>2]=t|1;k[u+t>>2]=t;return}f=(c&-8)+f|0;e=c>>>3;do if(c>>>0>=256){g=k[a+(o+16)>>2]|0;b=k[a+(o|4)>>2]|0;do if((b|0)==(q|0)){c=a+(o+12)|0;b=k[c>>2]|0;if(!b){c=a+(o+8)|0;b=k[c>>2]|0;if(!b){p=0;break}}while(1){d=b+20|0;e=k[d>>2]|0;if(e){b=e;c=d;continue}d=b+16|0;e=k[d>>2]|0;if(!e)break;else{b=e;c=d}}if(c>>>0<(k[151]|0)>>>0)Aa();else{k[c>>2]=0;p=b;break}}else{c=k[a+o>>2]|0;if(c>>>0<(k[151]|0)>>>0)Aa();d=c+12|0;if((k[d>>2]|0)!=(q|0))Aa();e=b+8|0;if((k[e>>2]|0)==(q|0)){k[d>>2]=b;k[e>>2]=c;p=b;break}else Aa()}while(0);if(g){b=k[a+(o+20)>>2]|0;c=892+(b<<2)|0;if((q|0)==(k[c>>2]|0)){k[c>>2]=p;if(!p){k[148]=k[148]&~(1<<b);break}}else{if(g>>>0<(k[151]|0)>>>0)Aa();b=g+16|0;if((k[b>>2]|0)==(q|0))k[b>>2]=p;else k[g+20>>2]=p;if(!p)break}c=k[151]|0;if(p>>>0<c>>>0)Aa();k[p+24>>2]=g;b=k[a+(o+8)>>2]|0;do if(b)if(b>>>0<c>>>0)Aa();else{k[p+16>>2]=b;k[b+24>>2]=p;break}while(0);b=k[a+(o+12)>>2]|0;if(b)if(b>>>0<(k[151]|0)>>>0)Aa();else{k[p+20>>2]=b;k[b+24>>2]=p;break}}}else{d=k[a+o>>2]|0;c=k[a+(o|4)>>2]|0;b=628+(e<<1<<2)|0;if((d|0)!=(b|0)){if(d>>>0<(k[151]|0)>>>0)Aa();if((k[d+12>>2]|0)!=(q|0))Aa()}if((c|0)==(d|0)){k[147]=k[147]&~(1<<e);break}if((c|0)!=(b|0)){if(c>>>0<(k[151]|0)>>>0)Aa();b=c+8|0;if((k[b>>2]|0)==(q|0))n=b;else Aa()}else n=c+8|0;k[d+12>>2]=c;k[n>>2]=d}while(0);k[u+4>>2]=f|1;k[u+f>>2]=f;if((u|0)==(k[152]|0)){k[149]=f;return}}else{k[b>>2]=c&-2;k[u+4>>2]=f|1;k[u+f>>2]=f}b=f>>>3;if(f>>>0<256){c=b<<1;e=628+(c<<2)|0;d=k[147]|0;b=1<<b;if(d&b){b=628+(c+2<<2)|0;c=k[b>>2]|0;if(c>>>0<(k[151]|0)>>>0)Aa();else{r=b;s=c}}else{k[147]=d|b;r=628+(c+2<<2)|0;s=e}k[r>>2]=u;k[s+12>>2]=u;k[u+8>>2]=s;k[u+12>>2]=e;return}b=f>>>8;if(b)if(f>>>0>16777215)e=31;else{r=(b+1048320|0)>>>16&8;s=b<<r;q=(s+520192|0)>>>16&4;s=s<<q;e=(s+245760|0)>>>16&2;e=14-(q|r|e)+(s<<e>>>15)|0;e=f>>>(e+7|0)&1|e<<1}else e=0;b=892+(e<<2)|0;k[u+28>>2]=e;k[u+20>>2]=0;k[u+16>>2]=0;c=k[148]|0;d=1<<e;a:do if(c&d){b=k[b>>2]|0;b:do if((k[b+4>>2]&-8|0)!=(f|0)){e=f<<((e|0)==31?0:25-(e>>>1)|0);while(1){c=b+16+(e>>>31<<2)|0;d=k[c>>2]|0;if(!d)break;if((k[d+4>>2]&-8|0)==(f|0)){t=d;break b}else{e=e<<1;b=d}}if(c>>>0<(k[151]|0)>>>0)Aa();else{k[c>>2]=u;k[u+24>>2]=b;k[u+12>>2]=u;k[u+8>>2]=u;break a}}else t=b;while(0);b=t+8|0;c=k[b>>2]|0;s=k[151]|0;if(c>>>0>=s>>>0&t>>>0>=s>>>0){k[c+12>>2]=u;k[b>>2]=u;k[u+8>>2]=c;k[u+12>>2]=t;k[u+24>>2]=0;break}else Aa()}else{k[148]=c|d;k[b>>2]=u;k[u+24>>2]=b;k[u+12>>2]=u;k[u+8>>2]=u}while(0);u=(k[155]|0)+-1|0;k[155]=u;if(!u)b=1044;else return;while(1){b=k[b>>2]|0;if(!b)break;else b=b+8|0}k[155]=-1;return}function Uc(a,b){a=a|0;b=b|0;var c=0,d=0;if(!a){a=Sc(b)|0;return a|0}if(b>>>0>4294967231){a=nc()|0;k[a>>2]=12;a=0;return a|0}c=Wc(a+-8|0,b>>>0<11?16:b+11&-8)|0;if(c){a=c+8|0;return a|0}c=Sc(b)|0;if(!c){a=0;return a|0}d=k[a+-4>>2]|0;d=(d&-8)-((d&3|0)==0?8:4)|0;cd(c|0,a|0,(d>>>0<b>>>0?d:b)|0)|0;Tc(a);a=c;return a|0}function Vc(a){a=a|0;var b=0;if(!a){b=0;return b|0}a=k[a+-4>>2]|0;b=a&3;if((b|0)==1){b=0;return b|0}b=(a&-8)-((b|0)==0?8:4)|0;return b|0}function Wc(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0;o=a+4|0;p=k[o>>2]|0;i=p&-8;l=a+i|0;h=k[151]|0;c=p&3;if(!((c|0)!=1&a>>>0>=h>>>0&a>>>0<l>>>0))Aa();d=a+(i|4)|0;e=k[d>>2]|0;if(!(e&1))Aa();if(!c){if(b>>>0<256){a=0;return a|0}if(i>>>0>=(b+4|0)>>>0?(i-b|0)>>>0<=k[267]<<1>>>0:0)return a|0;a=0;return a|0}if(i>>>0>=b>>>0){c=i-b|0;if(c>>>0<=15)return a|0;k[o>>2]=p&1|b|2;k[a+(b+4)>>2]=c|3;k[d>>2]=k[d>>2]|1;Xc(a+b|0,c);return a|0}if((l|0)==(k[153]|0)){c=(k[150]|0)+i|0;if(c>>>0<=b>>>0){a=0;return a|0}n=c-b|0;k[o>>2]=p&1|b|2;k[a+(b+4)>>2]=n|1;k[153]=a+b;k[150]=n;return a|0}if((l|0)==(k[152]|0)){d=(k[149]|0)+i|0;if(d>>>0<b>>>0){a=0;return a|0}c=d-b|0;if(c>>>0>15){k[o>>2]=p&1|b|2;k[a+(b+4)>>2]=c|1;k[a+d>>2]=c;d=a+(d+4)|0;k[d>>2]=k[d>>2]&-2;d=a+b|0}else{k[o>>2]=p&1|d|2;d=a+(d+4)|0;k[d>>2]=k[d>>2]|1;d=0;c=0}k[149]=c;k[152]=d;return a|0}if(e&2){a=0;return a|0}m=(e&-8)+i|0;if(m>>>0<b>>>0){a=0;return a|0}n=m-b|0;f=e>>>3;do if(e>>>0>=256){g=k[a+(i+24)>>2]|0;f=k[a+(i+12)>>2]|0;do if((f|0)==(l|0)){d=a+(i+20)|0;c=k[d>>2]|0;if(!c){d=a+(i+16)|0;c=k[d>>2]|0;if(!c){j=0;break}}while(1){e=c+20|0;f=k[e>>2]|0;if(f){c=f;d=e;continue}e=c+16|0;f=k[e>>2]|0;if(!f)break;else{c=f;d=e}}if(d>>>0<h>>>0)Aa();else{k[d>>2]=0;j=c;break}}else{e=k[a+(i+8)>>2]|0;if(e>>>0<h>>>0)Aa();c=e+12|0;if((k[c>>2]|0)!=(l|0))Aa();d=f+8|0;if((k[d>>2]|0)==(l|0)){k[c>>2]=f;k[d>>2]=e;j=f;break}else Aa()}while(0);if(g){c=k[a+(i+28)>>2]|0;d=892+(c<<2)|0;if((l|0)==(k[d>>2]|0)){k[d>>2]=j;if(!j){k[148]=k[148]&~(1<<c);break}}else{if(g>>>0<(k[151]|0)>>>0)Aa();c=g+16|0;if((k[c>>2]|0)==(l|0))k[c>>2]=j;else k[g+20>>2]=j;if(!j)break}d=k[151]|0;if(j>>>0<d>>>0)Aa();k[j+24>>2]=g;c=k[a+(i+16)>>2]|0;do if(c)if(c>>>0<d>>>0)Aa();else{k[j+16>>2]=c;k[c+24>>2]=j;break}while(0);c=k[a+(i+20)>>2]|0;if(c)if(c>>>0<(k[151]|0)>>>0)Aa();else{k[j+20>>2]=c;k[c+24>>2]=j;break}}}else{e=k[a+(i+8)>>2]|0;d=k[a+(i+12)>>2]|0;c=628+(f<<1<<2)|0;if((e|0)!=(c|0)){if(e>>>0<h>>>0)Aa();if((k[e+12>>2]|0)!=(l|0))Aa()}if((d|0)==(e|0)){k[147]=k[147]&~(1<<f);break}if((d|0)!=(c|0)){if(d>>>0<h>>>0)Aa();c=d+8|0;if((k[c>>2]|0)==(l|0))g=c;else Aa()}else g=d+8|0;k[e+12>>2]=d;k[g>>2]=e}while(0);if(n>>>0<16){k[o>>2]=m|p&1|2;b=a+(m|4)|0;k[b>>2]=k[b>>2]|1;return a|0}else{k[o>>2]=p&1|b|2;k[a+(b+4)>>2]=n|3;p=a+(m|4)|0;k[p>>2]=k[p>>2]|1;Xc(a+b|0,n);return a|0}return 0}function Xc(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;q=a+b|0;c=k[a+4>>2]|0;do if(!(c&1)){j=k[a>>2]|0;if(!(c&3))return;n=a+(0-j)|0;m=j+b|0;i=k[151]|0;if(n>>>0<i>>>0)Aa();if((n|0)==(k[152]|0)){d=a+(b+4)|0;c=k[d>>2]|0;if((c&3|0)!=3){t=n;g=m;break}k[149]=m;k[d>>2]=c&-2;k[a+(4-j)>>2]=m|1;k[q>>2]=m;return}f=j>>>3;if(j>>>0<256){e=k[a+(8-j)>>2]|0;d=k[a+(12-j)>>2]|0;c=628+(f<<1<<2)|0;if((e|0)!=(c|0)){if(e>>>0<i>>>0)Aa();if((k[e+12>>2]|0)!=(n|0))Aa()}if((d|0)==(e|0)){k[147]=k[147]&~(1<<f);t=n;g=m;break}if((d|0)!=(c|0)){if(d>>>0<i>>>0)Aa();c=d+8|0;if((k[c>>2]|0)==(n|0))h=c;else Aa()}else h=d+8|0;k[e+12>>2]=d;k[h>>2]=e;t=n;g=m;break}h=k[a+(24-j)>>2]|0;e=k[a+(12-j)>>2]|0;do if((e|0)==(n|0)){e=16-j|0;d=a+(e+4)|0;c=k[d>>2]|0;if(!c){d=a+e|0;c=k[d>>2]|0;if(!c){l=0;break}}while(1){e=c+20|0;f=k[e>>2]|0;if(f){c=f;d=e;continue}e=c+16|0;f=k[e>>2]|0;if(!f)break;else{c=f;d=e}}if(d>>>0<i>>>0)Aa();else{k[d>>2]=0;l=c;break}}else{f=k[a+(8-j)>>2]|0;if(f>>>0<i>>>0)Aa();c=f+12|0;if((k[c>>2]|0)!=(n|0))Aa();d=e+8|0;if((k[d>>2]|0)==(n|0)){k[c>>2]=e;k[d>>2]=f;l=e;break}else Aa()}while(0);if(h){c=k[a+(28-j)>>2]|0;d=892+(c<<2)|0;if((n|0)==(k[d>>2]|0)){k[d>>2]=l;if(!l){k[148]=k[148]&~(1<<c);t=n;g=m;break}}else{if(h>>>0<(k[151]|0)>>>0)Aa();c=h+16|0;if((k[c>>2]|0)==(n|0))k[c>>2]=l;else k[h+20>>2]=l;if(!l){t=n;g=m;break}}e=k[151]|0;if(l>>>0<e>>>0)Aa();k[l+24>>2]=h;c=16-j|0;d=k[a+c>>2]|0;do if(d)if(d>>>0<e>>>0)Aa();else{k[l+16>>2]=d;k[d+24>>2]=l;break}while(0);c=k[a+(c+4)>>2]|0;if(c)if(c>>>0<(k[151]|0)>>>0)Aa();else{k[l+20>>2]=c;k[c+24>>2]=l;t=n;g=m;break}else{t=n;g=m}}else{t=n;g=m}}else{t=a;g=b}while(0);i=k[151]|0;if(q>>>0<i>>>0)Aa();c=a+(b+4)|0;d=k[c>>2]|0;if(!(d&2)){if((q|0)==(k[153]|0)){s=(k[150]|0)+g|0;k[150]=s;k[153]=t;k[t+4>>2]=s|1;if((t|0)!=(k[152]|0))return;k[152]=0;k[149]=0;return}if((q|0)==(k[152]|0)){s=(k[149]|0)+g|0;k[149]=s;k[152]=t;k[t+4>>2]=s|1;k[t+s>>2]=s;return}g=(d&-8)+g|0;f=d>>>3;do if(d>>>0>=256){h=k[a+(b+24)>>2]|0;e=k[a+(b+12)>>2]|0;do if((e|0)==(q|0)){d=a+(b+20)|0;c=k[d>>2]|0;if(!c){d=a+(b+16)|0;c=k[d>>2]|0;if(!c){p=0;break}}while(1){e=c+20|0;f=k[e>>2]|0;if(f){c=f;d=e;continue}e=c+16|0;f=k[e>>2]|0;if(!f)break;else{c=f;d=e}}if(d>>>0<i>>>0)Aa();else{k[d>>2]=0;p=c;break}}else{f=k[a+(b+8)>>2]|0;if(f>>>0<i>>>0)Aa();c=f+12|0;if((k[c>>2]|0)!=(q|0))Aa();d=e+8|0;if((k[d>>2]|0)==(q|0)){k[c>>2]=e;k[d>>2]=f;p=e;break}else Aa()}while(0);if(h){c=k[a+(b+28)>>2]|0;d=892+(c<<2)|0;if((q|0)==(k[d>>2]|0)){k[d>>2]=p;if(!p){k[148]=k[148]&~(1<<c);break}}else{if(h>>>0<(k[151]|0)>>>0)Aa();c=h+16|0;if((k[c>>2]|0)==(q|0))k[c>>2]=p;else k[h+20>>2]=p;if(!p)break}d=k[151]|0;if(p>>>0<d>>>0)Aa();k[p+24>>2]=h;c=k[a+(b+16)>>2]|0;do if(c)if(c>>>0<d>>>0)Aa();else{k[p+16>>2]=c;k[c+24>>2]=p;break}while(0);c=k[a+(b+20)>>2]|0;if(c)if(c>>>0<(k[151]|0)>>>0)Aa();else{k[p+20>>2]=c;k[c+24>>2]=p;break}}}else{e=k[a+(b+8)>>2]|0;d=k[a+(b+12)>>2]|0;c=628+(f<<1<<2)|0;if((e|0)!=(c|0)){if(e>>>0<i>>>0)Aa();if((k[e+12>>2]|0)!=(q|0))Aa()}if((d|0)==(e|0)){k[147]=k[147]&~(1<<f);break}if((d|0)!=(c|0)){if(d>>>0<i>>>0)Aa();c=d+8|0;if((k[c>>2]|0)==(q|0))o=c;else Aa()}else o=d+8|0;k[e+12>>2]=d;k[o>>2]=e}while(0);k[t+4>>2]=g|1;k[t+g>>2]=g;if((t|0)==(k[152]|0)){k[149]=g;return}}else{k[c>>2]=d&-2;k[t+4>>2]=g|1;k[t+g>>2]=g}c=g>>>3;if(g>>>0<256){d=c<<1;f=628+(d<<2)|0;e=k[147]|0;c=1<<c;if(e&c){c=628+(d+2<<2)|0;d=k[c>>2]|0;if(d>>>0<(k[151]|0)>>>0)Aa();else{r=c;s=d}}else{k[147]=e|c;r=628+(d+2<<2)|0;s=f}k[r>>2]=t;k[s+12>>2]=t;k[t+8>>2]=s;k[t+12>>2]=f;return}c=g>>>8;if(c)if(g>>>0>16777215)f=31;else{r=(c+1048320|0)>>>16&8;s=c<<r;q=(s+520192|0)>>>16&4;s=s<<q;f=(s+245760|0)>>>16&2;f=14-(q|r|f)+(s<<f>>>15)|0;f=g>>>(f+7|0)&1|f<<1}else f=0;c=892+(f<<2)|0;k[t+28>>2]=f;k[t+20>>2]=0;k[t+16>>2]=0;d=k[148]|0;e=1<<f;if(!(d&e)){k[148]=d|e;k[c>>2]=t;k[t+24>>2]=c;k[t+12>>2]=t;k[t+8>>2]=t;return}c=k[c>>2]|0;a:do if((k[c+4>>2]&-8|0)!=(g|0)){f=g<<((f|0)==31?0:25-(f>>>1)|0);while(1){d=c+16+(f>>>31<<2)|0;e=k[d>>2]|0;if(!e)break;if((k[e+4>>2]&-8|0)==(g|0)){c=e;break a}else{f=f<<1;c=e}}if(d>>>0<(k[151]|0)>>>0)Aa();k[d>>2]=t;k[t+24>>2]=c;k[t+12>>2]=t;k[t+8>>2]=t;return}while(0);d=c+8|0;e=k[d>>2]|0;s=k[151]|0;if(!(e>>>0>=s>>>0&c>>>0>=s>>>0))Aa();k[e+12>>2]=t;k[d>>2]=t;k[t+8>>2]=e;k[t+12>>2]=c;k[t+24>>2]=0;return}function Yc(){}function Zc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;d=b-d-(c>>>0>a>>>0|0)>>>0;return (L=d,a-c>>>0|0)|0}function _c(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;c=a+c>>>0;return (L=b+d+(c>>>0<a>>>0|0)>>>0,c|0)|0}function $c(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=a+c|0;if((c|0)>=20){b=b&255;f=a&3;g=b|b<<8|b<<16|b<<24;e=d&~3;if(f){f=a+4-f|0;while((a|0)<(f|0)){i[a>>0]=b;a=a+1|0}}while((a|0)<(e|0)){k[a>>2]=g;a=a+4|0}}while((a|0)<(d|0)){i[a>>0]=b;a=a+1|0}return a-c|0}function ad(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){L=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}L=0;return b>>>c-32|0}function bd(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){L=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}L=a<<c-32;return 0}function cd(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;if((c|0)>=4096)return Ha(a|0,b|0,c|0)|0;d=a|0;if((a&3)==(b&3)){while(a&3){if(!c)return d|0;i[a>>0]=i[b>>0]|0;a=a+1|0;b=b+1|0;c=c-1|0}while((c|0)>=4){k[a>>2]=k[b>>2];a=a+4|0;b=b+4|0;c=c-4|0}}while((c|0)>0){i[a>>0]=i[b>>0]|0;a=a+1|0;b=b+1|0;c=c-1|0}return d|0}function dd(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){L=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}L=(b|0)<0?-1:0;return b>>c-32|0}function ed(a){a=a|0;var b=0;b=i[v+(a&255)>>0]|0;if((b|0)<8)return b|0;b=i[v+(a>>8&255)>>0]|0;if((b|0)<8)return b+8|0;b=i[v+(a>>16&255)>>0]|0;if((b|0)<8)return b+16|0;return (i[v+(a>>>24)>>0]|0)+24|0}function fd(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;f=a&65535;e=b&65535;c=ha(e,f)|0;d=a>>>16;a=(c>>>16)+(ha(e,d)|0)|0;e=b>>>16;b=ha(e,f)|0;return (L=(a>>>16)+(ha(e,d)|0)+(((a&65535)+b|0)>>>16)|0,a+b<<16|c&65535|0)|0}function gd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;j=b>>31|((b|0)<0?-1:0)<<1;i=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;f=d>>31|((d|0)<0?-1:0)<<1;e=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;h=Zc(j^a,i^b,j,i)|0;g=L;a=f^j;b=e^i;return Zc((ld(h,g,Zc(f^c,e^d,f,e)|0,L,0)|0)^a,L^b,a,b)|0}function hd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0;e=r;r=r+16|0;h=e|0;g=b>>31|((b|0)<0?-1:0)<<1;f=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;j=d>>31|((d|0)<0?-1:0)<<1;i=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;a=Zc(g^a,f^b,g,f)|0;b=L;ld(a,b,Zc(j^c,i^d,j,i)|0,L,h)|0;d=Zc(k[h>>2]^g,k[h+4>>2]^f,g,f)|0;c=L;r=e;return (L=c,d)|0}function id(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;f=c;c=fd(e,f)|0;a=L;return (L=(ha(b,f)|0)+(ha(d,e)|0)+a|a&0,c|0|0)|0}function jd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return ld(a,b,c,d,0)|0}function kd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;f=r;r=r+16|0;e=f|0;ld(a,b,c,d,e)|0;r=f;return (L=k[e+4>>2]|0,k[e>>2]|0)|0}function ld(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,l=0,m=0,n=0,o=0,p=0;l=a;i=b;j=i;g=c;n=d;h=n;if(!j){f=(e|0)!=0;if(!h){if(f){k[e>>2]=(l>>>0)%(g>>>0);k[e+4>>2]=0}n=0;e=(l>>>0)/(g>>>0)>>>0;return (L=n,e)|0}else{if(!f){n=0;e=0;return (L=n,e)|0}k[e>>2]=a|0;k[e+4>>2]=b&0;n=0;e=0;return (L=n,e)|0}}f=(h|0)==0;do if(g){if(!f){f=(ja(h|0)|0)-(ja(j|0)|0)|0;if(f>>>0<=31){m=f+1|0;h=31-f|0;b=f-31>>31;g=m;a=l>>>(m>>>0)&b|j<<h;b=j>>>(m>>>0)&b;f=0;h=l<<h;break}if(!e){n=0;e=0;return (L=n,e)|0}k[e>>2]=a|0;k[e+4>>2]=i|b&0;n=0;e=0;return (L=n,e)|0}f=g-1|0;if(f&g){h=(ja(g|0)|0)+33-(ja(j|0)|0)|0;p=64-h|0;m=32-h|0;i=m>>31;o=h-32|0;b=o>>31;g=h;a=m-1>>31&j>>>(o>>>0)|(j<<m|l>>>(h>>>0))&b;b=b&j>>>(h>>>0);f=l<<p&i;h=(j<<p|l>>>(o>>>0))&i|l<<m&h-33>>31;break}if(e){k[e>>2]=f&l;k[e+4>>2]=0}if((g|0)==1){o=i|b&0;p=a|0|0;return (L=o,p)|0}else{p=ed(g|0)|0;o=j>>>(p>>>0)|0;p=j<<32-p|l>>>(p>>>0)|0;return (L=o,p)|0}}else{if(f){if(e){k[e>>2]=(j>>>0)%(g>>>0);k[e+4>>2]=0}o=0;p=(j>>>0)/(g>>>0)>>>0;return (L=o,p)|0}if(!l){if(e){k[e>>2]=0;k[e+4>>2]=(j>>>0)%(h>>>0)}o=0;p=(j>>>0)/(h>>>0)>>>0;return (L=o,p)|0}f=h-1|0;if(!(f&h)){if(e){k[e>>2]=a|0;k[e+4>>2]=f&j|b&0}o=0;p=j>>>((ed(h|0)|0)>>>0);return (L=o,p)|0}f=(ja(h|0)|0)-(ja(j|0)|0)|0;if(f>>>0<=30){b=f+1|0;h=31-f|0;g=b;a=j<<h|l>>>(b>>>0);b=j>>>(b>>>0);f=0;h=l<<h;break}if(!e){o=0;p=0;return (L=o,p)|0}k[e>>2]=a|0;k[e+4>>2]=i|b&0;o=0;p=0;return (L=o,p)|0}while(0);if(!g){j=h;i=0;h=0}else{m=c|0|0;l=n|d&0;j=_c(m|0,l|0,-1,-1)|0;c=L;i=h;h=0;do{d=i;i=f>>>31|i<<1;f=h|f<<1;d=a<<1|d>>>31|0;n=a>>>31|b<<1|0;Zc(j,c,d,n)|0;p=L;o=p>>31|((p|0)<0?-1:0)<<1;h=o&1;a=Zc(d,n,o&m,(((p|0)<0?-1:0)>>31|((p|0)<0?-1:0)<<1)&l)|0;b=L;g=g-1|0}while((g|0)!=0);j=i;i=0}g=0;if(e){k[e>>2]=a;k[e+4>>2]=b}o=(f|0)>>>31|(j|g)<<1|(g<<1|f>>>31)&0|i;p=(f<<1|0>>>31)&-2|h;return (L=o,p)|0}function md(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return Ra[a&7](b|0,c|0,d|0)|0}function nd(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Sa[a&3](b|0,c|0,d|0,e|0,f|0)}function od(a,b){a=a|0;b=b|0;Ta[a&7](b|0)}function pd(a,b){a=a|0;b=b|0;return Ua[a&1](b|0)|0}function qd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;Va[a&0](b|0,c|0,d|0)}function rd(a){a=a|0;Wa[a&3]()}function sd(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;Xa[a&3](b|0,c|0,d|0,e|0,f|0,g|0)}function td(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;Ya[a&3](b|0,c|0,d|0,e|0)}function ud(a,b,c){a=a|0;b=b|0;c=c|0;ka(0);return 0}function vd(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;ka(1)}function wd(a){a=a|0;ka(2)}function xd(a){a=a|0;ka(3);return 0}function yd(a,b,c){a=a|0;b=b|0;c=c|0;ka(4)}function zd(){ka(5)}function Ad(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;ka(6)}function Bd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ka(7)}

// EMSCRIPTEN_END_FUNCS
        var Ra=[ud,Zb,Oc,Hc,Gc,Ic,ud,ud];var Sa=[vd,ec,dc,vd];var Ta=[wd,Ub,Xb,Vb,Wb,Yb,lc,Nc];var Ua=[xd,Fc];var Va=[yd];var Wa=[zd,jc,kc,zd];var Xa=[Ad,gc,fc,Ad];var Ya=[Bd,$b,ac,Bd];return{___cxa_can_catch:hc,_crn_get_levels:zb,_crn_get_uncompressed_size:Cb,_crn_decompress:Db,_i64Add:_c,_crn_get_width:xb,___cxa_is_pointer_type:ic,_crn_get_bytes_per_block:Bb,_memset:$c,_malloc:Sc,_memcpy:cd,_i64Subtract:Zc,_bitshift64Lshr:ad,_free:Tc,_bitshift64Shl:bd,_crn_get_height:yb,_crn_get_dxt_format:Ab,runPostSets:Yc,_emscripten_replace_memory:Qa,stackAlloc:Za,stackSave:_a,stackRestore:$a,establishStackSpace:ab,setThrew:bb,setTempRet0:eb,getTempRet0:fb,dynCall_iiii:md,dynCall_viiiii:nd,dynCall_vi:od,dynCall_ii:pd,dynCall_viii:qd,dynCall_v:rd,dynCall_viiiiii:sd,dynCall_viiii:td}})


    // EMSCRIPTEN_END_ASM
    (Module.asmGlobalArg,Module.asmLibraryArg,buffer);var ___cxa_can_catch=Module["___cxa_can_catch"]=asm["___cxa_can_catch"];var _crn_get_levels=Module["_crn_get_levels"]=asm["_crn_get_levels"];var runPostSets=Module["runPostSets"]=asm["runPostSets"];var _crn_get_uncompressed_size=Module["_crn_get_uncompressed_size"]=asm["_crn_get_uncompressed_size"];var _crn_decompress=Module["_crn_decompress"]=asm["_crn_decompress"];var _i64Add=Module["_i64Add"]=asm["_i64Add"];var _crn_get_height=Module["_crn_get_height"]=asm["_crn_get_height"];var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=asm["___cxa_is_pointer_type"];var _crn_get_bytes_per_block=Module["_crn_get_bytes_per_block"]=asm["_crn_get_bytes_per_block"];var _memset=Module["_memset"]=asm["_memset"];var _malloc=Module["_malloc"]=asm["_malloc"];var _memcpy=Module["_memcpy"]=asm["_memcpy"];var _emscripten_replace_memory=Module["_emscripten_replace_memory"]=asm["_emscripten_replace_memory"];var _i64Subtract=Module["_i64Subtract"]=asm["_i64Subtract"];var _bitshift64Lshr=Module["_bitshift64Lshr"]=asm["_bitshift64Lshr"];var _free=Module["_free"]=asm["_free"];var _crn_get_dxt_format=Module["_crn_get_dxt_format"]=asm["_crn_get_dxt_format"];var _crn_get_width=Module["_crn_get_width"]=asm["_crn_get_width"];var _bitshift64Shl=Module["_bitshift64Shl"]=asm["_bitshift64Shl"];var dynCall_iiii=Module["dynCall_iiii"]=asm["dynCall_iiii"];var dynCall_viiiii=Module["dynCall_viiiii"]=asm["dynCall_viiiii"];var dynCall_vi=Module["dynCall_vi"]=asm["dynCall_vi"];var dynCall_ii=Module["dynCall_ii"]=asm["dynCall_ii"];var dynCall_viii=Module["dynCall_viii"]=asm["dynCall_viii"];var dynCall_v=Module["dynCall_v"]=asm["dynCall_v"];var dynCall_viiiiii=Module["dynCall_viiiiii"]=asm["dynCall_viiiiii"];var dynCall_viiii=Module["dynCall_viiii"]=asm["dynCall_viiii"];Runtime.stackAlloc=asm["stackAlloc"];Runtime.stackSave=asm["stackSave"];Runtime.stackRestore=asm["stackRestore"];Runtime.establishStackSpace=asm["establishStackSpace"];Runtime.setTempRet0=asm["setTempRet0"];Runtime.getTempRet0=asm["getTempRet0"];function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}ExitStatus.prototype=new Error;ExitStatus.prototype.constructor=ExitStatus;var initialStackTop;var preloadStartTime=null;var calledMain=false;dependenciesFulfilled=function runCaller(){if(!Module["calledRun"])run();if(!Module["calledRun"])dependenciesFulfilled=runCaller};Module["callMain"]=Module.callMain=function callMain(args){assert(runDependencies==0,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");assert(__ATPRERUN__.length==0,"cannot call main when preRun functions remain to be called");args=args||[];ensureInitRuntime();var argc=args.length+1;function pad(){for(var i=0;i<4-1;i++){argv.push(0)}}var argv=[allocate(intArrayFromString(Module["thisProgram"]),"i8",ALLOC_NORMAL)];pad();for(var i=0;i<argc-1;i=i+1){argv.push(allocate(intArrayFromString(args[i]),"i8",ALLOC_NORMAL));pad()}argv.push(0);argv=allocate(argv,"i32",ALLOC_NORMAL);try{var ret=Module["_main"](argc,argv,0);exit(ret,true)}catch(e){if(e instanceof ExitStatus){return}else if(e=="SimulateInfiniteLoop"){Module["noExitRuntime"]=true;return}else{if(e&&typeof e==="object"&&e.stack)Module.printErr("exception thrown: "+[e,e.stack]);throw e}}finally{calledMain=true}};function run(args){args=args||Module["arguments"];if(preloadStartTime===null)preloadStartTime=Date.now();if(runDependencies>0){return}preRun();if(runDependencies>0)return;if(Module["calledRun"])return;function doRun(){if(Module["calledRun"])return;Module["calledRun"]=true;if(ABORT)return;ensureInitRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();if(Module["_main"]&&shouldRunNow)Module["callMain"](args);postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout((function(){setTimeout((function(){Module["setStatus"]("")}),1);doRun()}),1)}else{doRun()}}Module["run"]=Module.run=run;function exit(status,implicit){if(implicit&&Module["noExitRuntime"]){return}if(Module["noExitRuntime"]){}else{ABORT=true;EXITSTATUS=status;STACKTOP=initialStackTop;exitRuntime();if(Module["onExit"])Module["onExit"](status)}if(ENVIRONMENT_IS_NODE){process["stdout"]["once"]("drain",(function(){process["exit"](status)}));console.log(" ");setTimeout((function(){process["exit"](status)}),500)}else if(ENVIRONMENT_IS_SHELL&&typeof quit==="function"){quit(status)}throw new ExitStatus(status)}Module["exit"]=Module.exit=exit;var abortDecorators=[];function abort(what){if(what!==undefined){Module.print(what);Module.printErr(what);what=JSON.stringify(what)}else{what=""}ABORT=true;EXITSTATUS=1;var extra="\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";var output="abort("+what+") at "+stackTrace()+extra;if(abortDecorators){abortDecorators.forEach((function(decorator){output=decorator(output,what)}))}throw output}Module["abort"]=Module.abort=abort;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"]){shouldRunNow=false}Module["noExitRuntime"]=true;run()

    return Module;
});

define('Core/defaultValue',[
        './freezeObject'
    ], function(
        freezeObject) {
    'use strict';

    /**
     * Returns the first parameter if not undefined, otherwise the second parameter.
     * Useful for setting a default value for a parameter.
     *
     * @exports defaultValue
     *
     * @param {*} a
     * @param {*} b
     * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
     *
     * @example
     * param = Cesium.defaultValue(param, 'default');
     */
    function defaultValue(a, b) {
        if (a !== undefined && a !== null) {
            return a;
        }
        return b;
    }

    /**
     * A frozen empty object that can be used as the default value for options passed as
     * an object literal.
     */
    defaultValue.EMPTY_OBJECT = freezeObject({});

    return defaultValue;
});

define('Core/formatError',[
        './defined'
    ], function(
        defined) {
    'use strict';

    /**
     * Formats an error object into a String.  If available, uses name, message, and stack
     * properties, otherwise, falls back on toString().
     *
     * @exports formatError
     *
     * @param {Object} object The item to find in the array.
     * @returns {String} A string containing the formatted error.
     */
    function formatError(object) {
        var result;

        var name = object.name;
        var message = object.message;
        if (defined(name) && defined(message)) {
            result = name + ': ' + message;
        } else {
            result = object.toString();
        }

        var stack = object.stack;
        if (defined(stack)) {
            result += '\n' + stack;
        }

        return result;
    }

    return formatError;
});

define('Workers/createTaskProcessorWorker',[
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/formatError'
    ], function(
        defaultValue,
        defined,
        formatError) {
    'use strict';

    /**
     * Creates an adapter function to allow a calculation function to operate as a Web Worker,
     * paired with TaskProcessor, to receive tasks and return results.
     *
     * @exports createTaskProcessorWorker
     *
     * @param {createTaskProcessorWorker~WorkerFunction} workerFunction The calculation function,
     *        which takes parameters and returns a result.
     * @returns {createTaskProcessorWorker~TaskProcessorWorkerFunction} A function that adapts the
     *          calculation function to work as a Web Worker onmessage listener with TaskProcessor.
     *
     *
     * @example
     * function doCalculation(parameters, transferableObjects) {
     *   // calculate some result using the inputs in parameters
     *   return result;
     * }
     *
     * return Cesium.createTaskProcessorWorker(doCalculation);
     * // the resulting function is compatible with TaskProcessor
     *
     * @see TaskProcessor
     * @see {@link http://www.w3.org/TR/workers/|Web Workers}
     * @see {@link http://www.w3.org/TR/html5/common-dom-interfaces.html#transferable-objects|Transferable objects}
     */
    function createTaskProcessorWorker(workerFunction) {
        var postMessage;
        var transferableObjects = [];
        var responseMessage = {
            id : undefined,
            result : undefined,
            error : undefined
        };

        return function(event) {
            /*global self*/
            var data = event.data;

            transferableObjects.length = 0;
            responseMessage.id = data.id;
            responseMessage.error = undefined;
            responseMessage.result = undefined;

            try {
                responseMessage.result = workerFunction(data.parameters, transferableObjects);
            } catch (e) {
                if (e instanceof Error) {
                    // Errors can't be posted in a message, copy the properties
                    responseMessage.error = {
                        name : e.name,
                        message : e.message,
                        stack : e.stack
                    };
                } else {
                    responseMessage.error = e;
                }
            }

            if (!defined(postMessage)) {
                postMessage = defaultValue(self.webkitPostMessage, self.postMessage);
            }

            if (!data.canTransferArrayBuffer) {
                transferableObjects.length = 0;
            }

            try {
                postMessage(responseMessage, transferableObjects);
            } catch (e) {
                // something went wrong trying to post the message, post a simpler
                // error that we can be sure will be cloneable
                responseMessage.result = undefined;
                responseMessage.error = 'postMessage failed with error: ' + formatError(e) + '\n  with responseMessage: ' + JSON.stringify(responseMessage);
                postMessage(responseMessage);
            }
        };
    }

    /**
     * A function that performs a calculation in a Web Worker.
     * @callback createTaskProcessorWorker~WorkerFunction
     *
     * @param {Object} parameters Parameters to the calculation.
     * @param {Array} transferableObjects An array that should be filled with references to objects inside
     *        the result that should be transferred back to the main document instead of copied.
     * @returns {Object} The result of the calculation.
     *
     * @example
     * function calculate(parameters, transferableObjects) {
     *   // perform whatever calculation is necessary.
     *   var typedArray = new Float32Array(0);
     *
     *   // typed arrays are transferable
     *   transferableObjects.push(typedArray)
     *
     *   return {
     *      typedArray : typedArray
     *   };
     * }
     */

    /**
     * A Web Worker message event handler function that handles the interaction with TaskProcessor,
     * specifically, task ID management and posting a response message containing the result.
     * @callback createTaskProcessorWorker~TaskProcessorWorkerFunction
     *
     * @param {Object} event The onmessage event object.
     */

    return createTaskProcessorWorker;
});

define('Workers/transcodeCRNToDXT',[
        '../Core/CompressedTextureBuffer',
        '../Core/defined',
        '../Core/PixelFormat',
        '../Core/RuntimeError',
        '../ThirdParty/crunch',
        './createTaskProcessorWorker'
    ], function(
        CompressedTextureBuffer,
        defined,
        PixelFormat,
        RuntimeError,
        crunch,
        createTaskProcessorWorker) {
    'use strict';

    // Modified from texture-tester
    // See:
    //     https://github.com/toji/texture-tester/blob/master/js/webgl-texture-util.js
    //     http://toji.github.io/texture-tester/

    /**
     * @license
     *
     * Copyright (c) 2014, Brandon Jones. All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without modification,
     * are permitted provided that the following conditions are met:
     *
     *  * Redistributions of source code must retain the above copyright notice, this
     *  list of conditions and the following disclaimer.
     *  * Redistributions in binary form must reproduce the above copyright notice,
     *  this list of conditions and the following disclaimer in the documentation
     *  and/or other materials provided with the distribution.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
     * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
     * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
     * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
     * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */

    // Taken from crnlib.h
    var CRN_FORMAT = {
        cCRNFmtInvalid: -1,

        cCRNFmtDXT1: 0,
        // cCRNFmtDXT3 is not currently supported when writing to CRN - only DDS.
        cCRNFmtDXT3: 1,
        cCRNFmtDXT5: 2

        // Crunch supports more formats than this, but we can't use them here.
    };

    // Mapping of Crunch formats to DXT formats.
    var DXT_FORMAT_MAP = {};
    DXT_FORMAT_MAP[CRN_FORMAT.cCRNFmtDXT1] = PixelFormat.RGB_DXT1;
    DXT_FORMAT_MAP[CRN_FORMAT.cCRNFmtDXT3] = PixelFormat.RGBA_DXT3;
    DXT_FORMAT_MAP[CRN_FORMAT.cCRNFmtDXT5] = PixelFormat.RGBA_DXT5;

    var dst;
    var dxtData;
    var cachedDstSize = 0;

    // Copy an array of bytes into or out of the emscripten heap.
    function arrayBufferCopy(src, dst, dstByteOffset, numBytes) {
        var i;
        var dst32Offset = dstByteOffset / 4;
        var tail = (numBytes % 4);
        var src32 = new Uint32Array(src.buffer, 0, (numBytes - tail) / 4);
        var dst32 = new Uint32Array(dst.buffer);
        for (i = 0; i < src32.length; i++) {
            dst32[dst32Offset + i] = src32[i];
        }
        for (i = numBytes - tail; i < numBytes; i++) {
            dst[dstByteOffset + i] = src[i];
        }
    }

    /**
     * @private
     */
    function transcodeCRNToDXT(arrayBuffer, transferableObjects) {
        // Copy the contents of the arrayBuffer into emscriptens heap.
        var srcSize = arrayBuffer.byteLength;
        var bytes = new Uint8Array(arrayBuffer);
        var src = crunch._malloc(srcSize);
        arrayBufferCopy(bytes, crunch.HEAPU8, src, srcSize);

        // Determine what type of compressed data the file contains.
        var crnFormat = crunch._crn_get_dxt_format(src, srcSize);
        var format = DXT_FORMAT_MAP[crnFormat];
        if (!defined(format)) {
            throw new RuntimeError('Unsupported compressed format.');
        }

        // Gather basic metrics about the DXT data.
        var levels = crunch._crn_get_levels(src, srcSize);
        var width = crunch._crn_get_width(src, srcSize);
        var height = crunch._crn_get_height(src, srcSize);

        // Determine the size of the decoded DXT data.
        var dstSize = 0;
        var i;
        for (i = 0; i < levels; ++i) {
            dstSize += PixelFormat.compressedTextureSizeInBytes(format, width >> i, height >> i);
        }

        // Allocate enough space on the emscripten heap to hold the decoded DXT data
        // or reuse the existing allocation if a previous call to this function has
        // already acquired a large enough buffer.
        if(cachedDstSize < dstSize) {
            if(defined(dst)) {
                crunch._free(dst);
            }
            dst = crunch._malloc(dstSize);
            dxtData = new Uint8Array(crunch.HEAPU8.buffer, dst, dstSize);
            cachedDstSize = dstSize;
        }

        // Decompress the DXT data from the Crunch file into the allocated space.
        crunch._crn_decompress(src, srcSize, dst, dstSize, 0, levels);

        // Release the crunch file data from the emscripten heap.
        crunch._free(src);

        // Mipmaps are unsupported, so copy the level 0 texture
        // When mipmaps are supported, a copy will still be necessary as dxtData is a view on the heap.
        var length = PixelFormat.compressedTextureSizeInBytes(format, width, height);

        // Get a copy of the 0th mip level. dxtData will exceed length when there are more mip levels.
        // Equivalent to dxtData.slice(0, length), which is not supported in IE11
        var level0DXTDataView = dxtData.subarray(0, length);
        var level0DXTData = new Uint8Array(length);
        level0DXTData.set(level0DXTDataView, 0);

        transferableObjects.push(level0DXTData.buffer);
        return new CompressedTextureBuffer(format, width, height, level0DXTData);
    }

    return createTaskProcessorWorker(transcodeCRNToDXT);
});

}());