class SizeAdjustableText {

    constructor($container, startingSize) {

        // Public field declarations with private aliases for ease of use
        let $el = this.$el = $container;
        let text = this.text = $el.val();
        let fontSize = this.fontSize = startingSize;

        // Put text in hidden element and update the hidden element before we update the real element to decide if
        // we need to do a font resize
        let $shadow = this.$shadow = $('<textarea class="meme-caption" wrap="on">' + text + '</textarea>');
        $shadow.css({
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden'
        });
        $('body').append($shadow);

        // Set the font size of our elements to the specified font size
        this.setControlCss({'font-size': fontSize + 'px'});

        // When the user presses a key, we want to see if the addition of the character will require a font resize.
        // When the user releases a key, we want to actually add the character to the textarea.
        $el.keyup( a => {
            text = $el.val();
            this.captionKeyUpHandler(a);
        });
        $el.keydown(a => {
            this.captionKeyDownHandler(a);
        });
    }

    /**
     * Apply one set of CSS rules to all of our elements
     * @param cssStyles
     */
    setControlCss(cssStyles) {
        this.$el.css(cssStyles);
        this.$shadow.css(cssStyles);
    }

    /**
     * Updates the font size to a new value
     * @param newFontSize
     */
    setFontSize(newFontSize) {
        this.fontSize = newFontSize;
        this.setControlCss({'font-size': this.fontSize + 'px'});
    }

    /**
     * If a key other than the escape key was pressed, make it upper case, put it into the textbox, and resize the
     * textbox if necessary
     * @param a
     */
    captionKeyUpHandler(a) {
        let $el = this.$el;

        if (27 == a.which) {
            $el.val(text);
        } else if ($el.val().length) {
            this.text = $el.val();
            this.fitTextWrap();
        } else {
            text = this.text = ' ';
            $shadow.hasClass('placeHolder') && $shadow.removeClass('placeHolder');
            $shadow.val(text);
        }
    }

    /**
     * Update the hidden text element with the character to be added so that we can see if the font size will need to be
     * changed. Also convert the character to be added to uppercase.
     * @param a
     */
    captionKeyDownHandler(a) {
        let $shadow = this.$shadow;
        let $el = this.$el;
        let fontSize = this.fontSize;

        $shadow.val($el.val() + String.fromCharCode(a.keyCode));

        while (($el.get(0).scrollHeight - 4) > $shadow.height() && fontSize > 0) {
            this.setFontSize(--fontSize);
        }
    }

    /**
     * Determines whether to shrink the font or enlarge the font so that the text will fit in the textarea
     */
    fitTextWrap() {
        let $el = this.$el;
        let text = this.text;
        let fontSize = this.fontSize;

        if (text && text.length) {
            while (($el.get(0).scrollHeight - 4) <= $el.height() && fontSize < 1000) {
                this.setFontSize(++fontSize);
            }
            while (($el.get(0).scrollHeight - 4) > $el.height() && fontSize > 0) {
                this.setFontSize(--fontSize);
            }
        }
    }
}