DG.Control.Ruler = DG.RoundControl.extend({

    options: {
        position: DG.Browser.touch ? 'bottomright' : 'topright',
        iconClass: 'ruler'
    },

    statics: {
        Dictionary: {}
    },

    initialize: function (options) {
        DG.setOptions(this, options);
        DG.extend(this, {
            _active: false,
            _drawingHelper: null,
            _geoclickerNeedRestore: false
        }).on(this._controlEvents, this);
    },

    _controlEvents: {
        add: function () {
            this._drawingHelper = DG.ruler([]);
        },
        click: function () {
            if (this._active = !this._active) { // jshint ignore:line
                this.setState('active');
                this._startDrawing();
            } else {
                this.setState('');
                this._finishDrawing();
            }
        },
        remove: function () {
            this.off(this._controlEvents, this);
            if (this._active) {
                this._map.removeLayer(this._drawingHelper);
                this._active = false;
            }
            this._drawingHelper = null;
        }
    },

    _startDrawing: function () { // ()
        this._map
                .addLayer(this._drawingHelper)
                .on('click', this._handleMapClick, this);

        if (this._geoclickerNeedRestore = this._map.geoclicker.enabled()) { // jshint ignore:line
            this._map.geoclicker.disable();
        }
    },

    _finishDrawing: function () { // ()
        this._map
                .off('click', this._handleMapClick, this)
                .removeLayer(this._drawingHelper);
        this._drawingHelper.setLatLngs([]);
        if (this._geoclickerNeedRestore) {
            this._map.geoclicker.enable();
        }
    },

    _handleMapClick: function (event) {   // (MouseEvents)
        var latlng = event.latlng;//.wrap();
        if (!latlng.equals(event.latlng)) {
            this._map.fitWorld();
        }
        this._drawingHelper.addLatLng(latlng);
    },

    _renderTranslation: function () {
        this._link.title = this.t('button_title');
    }
});

DG.control.ruler = function (options) {
    return new DG.Control.Ruler(options);
};