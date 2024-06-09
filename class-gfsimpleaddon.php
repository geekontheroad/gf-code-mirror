<?php

GFForms::include_addon_framework();

class GFSimpleAddOn extends GFAddOn
{

    protected $_version = GF_SIMPLE_ADDON_VERSION;
    protected $_min_gravityforms_version = '1.9';
    protected $_slug = 'simpleaddon';
    protected $_path = 'simpleaddon/simpleaddon.php';
    protected $_full_path = __FILE__;
    protected $_title = 'Gravity Forms CodeMirror Test Add-On';
    protected $_short_title = 'CodeMirror';

    private static $_instance = null;

    /**
     * Get an instance of this class.
     *
     * @return GFSimpleAddOn
     */
    public static function get_instance()
    {
        if (self::$_instance == null ) {
            self::$_instance = new GFSimpleAddOn();
        }

        return self::$_instance;
    }

    /**
     * Handles hooks and loading of language files.
     */
    public function init()
    {
        parent::init();
      
    }


    // # SCRIPTS & STYLES -----------------------------------------------------------------------------------------------

    /**
     * Return the scripts which should be enqueued.
     *
     * @return array
     */
    public function scripts()
    {
        $scripts = array(
        array(
        'handle'  => 'my_script_js',
        'src'     => $this->get_base_url() . '/dist/bundle.js',
        'version' => $this->_version,
        'deps'    => array( 'jquery' ),        
        'enqueue' => array(
                    array(
                        'admin_page' => array( 'plugin_settings' ),
                        'tab'        => 'simpleaddon'
        )
        )
        ),

        );

        return array_merge(parent::scripts(), $scripts);
    }

    /**
     * Return the stylesheets which should be enqueued.
     *
     * @return array
     */
    public function styles()
    {
        $styles = array(
        array(
        'handle'  => 'my_styles_css',
        'src'     => $this->get_base_url() . '/css/my_styles.css',
        'version' => $this->_version,
        'enqueue' => array(
        array( 'field_types' => array( 'poll' ) )
        )
        )
        );

        return array_merge(parent::styles(), $styles);
    }


    // # FRONTEND FUNCTIONS --------------------------------------------------------------------------------------------

   


    // # ADMIN FUNCTIONS -----------------------------------------------------------------------------------------------

    /**
     * Creates a custom page for this add-on.
     */
    public function plugin_page()
    {
        echo 'This page appears in the Forms menu';
    }

    /**
     * Configures the settings which should be rendered on the add-on settings tab.
     *
     * @return array
     */
	public function plugin_settings_fields() {
		return array(
			array(
				'title'  => esc_html__('CodeMirror JS editor', 'simpleaddon'),
				'fields' => array(
					array(
						'name'              => 'myeditor',
						'tooltip'           => esc_html__('This is the tooltip', 'simpleaddon'),
						'label'             => esc_html__('This is the label', 'simpleaddon'),
						'type'              => 'html',
						'callback'          => array($this, 'render_code_mirror_editor'),
					),
				),
			),
		);
	}
	
	public function render_code_mirror_editor() {
		echo '<div id="my-editor" style="border: 1px solid #ccc; height: 200px;"></div>';
	}

    /**
     * Configures the settings which should be rendered on the Form Settings > Simple Add-On tab.
     *
     * @return array
     */
    public function form_settings_fields( $form )  {
       return array();
    }




 




}
