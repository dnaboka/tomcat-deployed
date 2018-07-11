    jQuery.noConflict(true);
    jasper.noConflict(true);
    _.noConflict();

    //Expose __jrsConfigs__ as a property of visualize to be able to configure it
    visualize.__jrsConfigs__ = __jrsConfigs__;

    // visualize namespace
    global.__visualize__ = __visualize__;
}(this));
