/*

Usage:
var lightbox = new Lightbox({
    selector: '.lightbox',
});

*/

window.Lightbox = function(options) {
    // Default settings
    this.defaults = {
        selector: '.lightbox',
        className: 'lightbox',
        closeDelay: 500,
        attributePrefix: 'data-lightbox',
        loop: true,
    }
    // Merge defaults and options into settings to use
    Object.assign(this.setting = {}, this.defaults, options);

    // Add click event listeners to all elements
    var elements = document.querySelectorAll(this.setting.selector);
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function(e) {
            e.preventDefault();
            open(this);
        });
        // Set data-lightbox-index attribute if not present
        if (!elements[i].getAttribute(this.setting.attributePrefix + '-index')) {
            elements[i].setAttribute(this.setting.attributePrefix + '-index', i);
        }
    }

    // Create parent so functions can access this
    var parent = this;
    var currentIndex = -1;

    // With this function you can open the Lightbox based on data-lightbox-index value
    function openByIndex(index) {
        if (currentIndex > -1 && parent.DOMelement) {
            if (index < 0) {
                index = parent.setting.loop ? elements.length - 1 : 0;
            }
            if (index > elements.length - 1) {
                index = parent.setting.loop ? 0 : elements.length - 1;
            }
            if (currentIndex != index) {
                open(elements[index]);
            }
        }
    }

    // Listen for keypresses
    function keydown(e) {
        if (e.key == 'Escape') {
            close(e)
        }
        if (e.key == 'ArrowLeft') {
            openByIndex(currentIndex - 1)
        }
        if (e.key == 'ArrowRight') {
            openByIndex(currentIndex + 1)
        }
    }
    window.addEventListener('keydown', keydown);

    // Close the Lightbox
    function close(e) {
        if (e.target.classList.contains(parent.setting.className+'-button') && !e.target.classList.contains(parent.setting.className+'-button-close')) {
            return false;
        }
        if (parent.DOMelement) {
            parent.DOMelement.classList.remove('active');
            currentIndex = -1;
            setTimeout(function() {
                if (parent.DOMelement) {
                    parent.DOMelement.parentNode.removeChild(parent.DOMelement);
                    parent.DOMelement = null;
                }
            }, parent.setting.closeDelay);
        }
    }

    // Open the Lightbox
    function open(t) {
        // Get attributes and info about the link
        currentIndex = parseInt(t.getAttribute(parent.setting.attributePrefix + '-index'));
        var href = t.getAttribute('href');
        var ext = href.split('.').pop().toLowerCase();
        var isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg'].indexOf(ext) > -1;

        // Create main DOM element if not present
        if (!parent.DOMelement) {
            var html = document.createElement('DIV');
            html.addEventListener('click', close);
            html.className = parent.setting.className+'-modal';
            parent.DOMelement = document.body.appendChild(html);
        }

        // Create html output
        var html = '<div class="'+parent.setting.className+'-container">';
        if (isImage) {
            html += '<img class="'+parent.setting.className+'-image" src="'+href+'">';
        }
        html += '</div>';
        parent.DOMelement.innerHTML = html;

        // Add close button
        var button = document.createElement('SPAN');
        button.classList.add(parent.setting.className+'-button');
        button.classList.add(parent.setting.className+'-button-close');
        parent.DOMelement.appendChild(button);

        // Add previous button if needed
        if (elements.length > 1 && (currentIndex > 0 || parent.setting.loop)) {
            var button = document.createElement('SPAN');
            button.classList.add(parent.setting.className+'-button');
            button.classList.add(parent.setting.className+'-button-prev');
            parent.DOMelement.appendChild(button).addEventListener('click', function(e) {
                openByIndex(currentIndex - 1);
            });
        }

        // Add next button if needed
        if (elements.length > 1 && (currentIndex < elements.length - 1 || parent.setting.loop)) {
            var button = document.createElement('SPAN');
            button.classList.add(parent.setting.className+'-button');
            button.classList.add(parent.setting.className+'-button-next');
            parent.DOMelement.appendChild(button).addEventListener('click', function(e) {
                openByIndex(currentIndex + 1);
            });
        }

        // Trigger recalc/delay so active transition works
        void parent.DOMelement.offsetWidth;
        parent.DOMelement.classList.add('active');
    }
}
