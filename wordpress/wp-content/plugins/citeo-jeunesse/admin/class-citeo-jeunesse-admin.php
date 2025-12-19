<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/admin
 * @author     citeo <citeo@citeo.com>
 */
class Citeo_Jeunesse_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		add_action('admin_init', array($this, 'handle_export'));

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Citeo_Jeunesse_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Citeo_Jeunesse_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/citeo-jeunesse-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Citeo_Jeunesse_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Citeo_Jeunesse_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/citeo-jeunesse-admin.js', array(), $this->version, false );

	}

	public function add_menu_page() {
		add_menu_page(
			$this->plugin_name,
			'Enregistrement Jeunesse',
			'administrator',
			$this->plugin_name,
			array(
				$this,
				'show_registered',
			),
			'dashicons-list-view',
			20
		);
		add_submenu_page($this->plugin_name, $this->plugin_name, 'Entrées', 'manage_options', $this->plugin_name);
		add_submenu_page($this->plugin_name, 'Sondage', 'Sondage', 'manage_options', $this->plugin_name.'-sondage', array($this, 'displayAdminSondage'));
		add_submenu_page(
			$this->plugin_name,
			'Export',
			'Exporter',
			'manage_options',
			$this->plugin_name.'-export-data',
			array(
				$this,
				'displayAdminExportData'
			)
		);
	}
	

	public function show_registered() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'citeo_jeunesse_form';
		
		// Configuration de la pagination
		$paged = isset($_GET['paged']) ? absint($_GET['paged']) : 1;
		$per_page = 20;
		$offset = ($paged - 1) * $per_page;

		// Gestion du tri
		$allowed_columns = [
			'ID' => 'ID',
			'type' => 'type',
			'statut' => 'statut',
			'nombre_enfant' => 'nombre_enfant',
			'visionnement_video' => 'visionnement_video',
			'opt_in' => 'opt_in',
			'refuse_survey' => 'refuse_survey',
			'date_inscription' => 'date_inscription',
			'import_newsletter' => 'import_newsletter'
		];
		
		$orderby = isset($_GET['orderby']) && array_key_exists($_GET['orderby'], $allowed_columns) 
			? $allowed_columns[$_GET['orderby']] 
			: 'ID';
		
		$order = (isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC'])) 
			? strtoupper($_GET['order']) 
			: 'DESC';

		// Construction de la requête avec filtres
		$where = array();
		$params = array();

		if (isset($_GET['filter_statut']) && !empty($_GET['filter_statut'])) {
			$where[] = 'statut = %s';
			$params[] = sanitize_text_field($_GET['filter_statut']);
		}

		// Requête de base
		$sql = "SELECT * FROM $table_name";
		
		// Ajout des conditions WHERE
		if (!empty($where)) {
			$sql .= ' WHERE ' . implode(' AND ', $where);
		}

		// Ajout du tri
		$sql .= " ORDER BY $orderby $order";

		// Comptage total
		$count_sql = "SELECT COUNT(*) FROM $table_name";
		if (!empty($where)) {
			$count_sql .= ' WHERE ' . implode(' AND ', $where);
		}
		$total_items = $wpdb->get_var($wpdb->prepare($count_sql, $params));
		$total_pages = ceil($total_items / $per_page);

		// Ajout de la pagination
		$sql .= " LIMIT %d OFFSET %d";
		$params[] = $per_page;
		$params[] = $offset;


		// Exécution de la requête
		$resultats = $wpdb->get_results($wpdb->prepare($sql, $params));
		
		// Génération de la pagination
		$pagination = paginate_links(array(
			'base' => add_query_arg('paged', '%#%'),
			'format' => '',
			'prev_text' => __('‹'),
			'next_text' => __('›'),
			'total' => $total_pages,
			'current' => $paged,
			'type' => 'array'
		));

		echo '<h2>Enregistrements Jeunesse CHANTIER DE MARQUES</h2>';

		// Affichage natif WordPress
		echo '<div class="tablenav top">';
		echo '<div class="tablenav-pages">';
		echo '<span class="displaying-num">' . number_format_i18n($total_items) . ' éléments</span>';
		if ($total_pages) : 
			echo '<span class="pagination-links">';
				echo $this->format_pagination_links($pagination, $paged, $total_pages);
			echo '</span>';
		endif;
		echo '</div>';
		echo '<br class="clear">';
		echo '</div>';
		// Affichage des filtres de tri
		echo '<table class="wp-list-table widefat fixed striped">';
		echo '<thead><tr>';
		
		// Fonction pour générer les liens de tri
		$sortable_columns = [
			'ID' => 'ID',
			'Type' => 'type',
			'Statut' => 'statut',
			'Nombre d\'enfants' => 'nombre_enfant',
			'Visionne maintenant avec des enfants' => 'visionnement_video',
			'Abonné Newsletter' => 'opt_in',
			'Refuse Sondage' => 'refuse_survey',
			'Date' => 'date_inscription',
		];
		
		foreach ($sortable_columns as $label => $column) {
			$new_order = ($orderby === $column && $order === 'ASC') ? 'DESC' : 'ASC';
			$class = ($orderby === $column) ? ' sorted ' . strtolower($order) : '';
			
			echo '<th class="'.$class.'">';
			echo '<a href="' . esc_url(add_query_arg([
				'orderby' => $column,
				'order' => $new_order,
				'paged' => 1
			])) . '">' . esc_html($label);
			
			if ($orderby === $column) {
				echo ' <span class="dashicons dashicons-arrow-' . ($order === 'ASC' ? 'up' : 'down') . '"></span>';
			}
			
			echo '</a></th>';
		}
		
		// Colonne Email non triable
		echo '</tr></thead>';
		// Corps du tableau (existant)
		echo '<tbody>';
		foreach ($resultats as $enregistrement) {	
			if ($enregistrement->type == "autre") {
				$enregistrement->type = "PDF";
			}
			echo '<tr>';
			echo '<td>' . $enregistrement->ID . '</td>';
			echo '<td>' . $enregistrement->type . '</td>';
			echo '<td>' . $enregistrement->statut . '</td>';
			echo '<td>' . $enregistrement->nombre_enfant . '</td>';
			echo '<td>' . ($enregistrement->visionnement_video ? 'Oui' : 'Non') . '</td>';
			echo '<td>' . ($enregistrement->opt_in ? 'Oui' : 'Non') . '</td>';
			echo '<td>' . ($enregistrement->refuse_survey ? 'Oui' : 'Non') . '</td>';
			echo '<td>' . $enregistrement->date_inscription . '</td>';
			echo '</tr>';
		}
		echo '</tbody></table>';
		// Pagination (existant)
		echo '<div class="tablenav">';
		echo '<div class="tablenav-pages">';
		echo paginate_links([
			'base' => add_query_arg('paged', '%#%'),
			'format' => '',
			'prev_text' => __('&laquo; Précédent'),
			'next_text' => __('Suivant &raquo;'),
			'total' => ceil($total_items / $per_page),
			'current' => $paged
		]);
		echo '</div></div>';
	}

	private function format_pagination_links($pagination, $current_page, $total_pages) {
		ob_start();
		?>
		<span class="pagination-links">
			<?php if ($current_page > 2) : ?>
				<a class="first-page button" href="<?php echo esc_url(add_query_arg('paged', 1)); ?>">
					<span class="screen-reader-text">Première page</span>
					<span aria-hidden="true">«</span>
				</a>
			<?php else : ?>
				<span class="tablenav-pages-navspan button disabled" aria-hidden="true">«</span>
			<?php endif; ?>

			<?php if ($current_page > 1) : ?>
				<a class="prev-page button" href="<?php echo esc_url(add_query_arg('paged', $current_page - 1)); ?>">
					<span class="screen-reader-text">Page précédente</span>
					<span aria-hidden="true">‹</span>
				</a>
			<?php else : ?>
				<span class="tablenav-pages-navspan button disabled" aria-hidden="true">‹</span>
			<?php endif; ?>

			<span class="paging-input">
				<label for="current-page-selector" class="screen-reader-text">Page actuelle</label>
				<input class="current-page" id="current-page-selector" type="text" 
					name="paged" value="<?php echo $current_page; ?>" size="1" 
					aria-describedby="table-paging">
				<span class="tablenav-paging-text"> sur 
					<span class="total-pages"><?php echo $total_pages; ?></span>
				</span>
			</span>

			<?php if ($current_page < $total_pages) : ?>
				<a class="next-page button" href="<?php echo esc_url(add_query_arg('paged', $current_page + 1)); ?>">
					<span class="screen-reader-text">Page suivante</span>
					<span aria-hidden="true">›</span>
				</a>
				<a class="last-page button" href="<?php echo esc_url(add_query_arg('paged', $total_pages)); ?>">
					<span class="screen-reader-text">Dernière page</span>
					<span aria-hidden="true">»</span>
				</a>
			<?php else : ?>
				<span class="tablenav-pages-navspan button disabled" aria-hidden="true">›</span>
				<span class="tablenav-pages-navspan button disabled" aria-hidden="true">»</span>
			<?php endif; ?>
		</span>
		<?php
		return ob_get_clean();
	}

	public function displayAdminExportData() {
		?>
        <div class="wrap">
            <h2>Exporter les données</h2>
            <form method="post">
				<?php wp_nonce_field('citeo_export_data', 'citeo_nonce'); ?>
				<ul>
					<li>
						<label for="table-export"><?php esc_html_e('Table à exporter :', 'citeo-jeunesse'); ?></label>
						<select name="table_export" id="table-export">
							<option value="form"><?php esc_html_e('Formulaire', 'citeo-jeunesse'); ?></option>
							<option value="sondage"><?php esc_html_e('Sondage', 'citeo-jeunesse'); ?></option>
						</select>
					</li>
					<li class="form-filters">
						<label><?php esc_html_e('Type de données :', 'citeo-jeunesse'); ?></label>
						<select name="type_export">
							<option value="all"><?php esc_html_e('Toutes les données', 'citeo-jeunesse'); ?></option>
							<option value="video"><?php esc_html_e('Données de type Vidéo', 'citeo-jeunesse'); ?></option>
							<option value="autre"><?php esc_html_e('Données de type Autre', 'citeo-jeunesse'); ?></option>
							<option value="opt_in"><?php esc_html_e('Abonnés Newsletter', 'citeo-jeunesse'); ?></option>
						</select>
					</li>
					<li>
						<label for="start-date"><?php esc_html_e('Date de début :', 'citeo-jeunesse'); ?></label>
						<input type="date" id="start-date" name="start_date">
					</li>
					<li>
						<label for="end-date"><?php esc_html_e('Date de fin :', 'citeo-jeunesse'); ?></label>
						<input type="date" id="end-date" name="end_date">
					</li>
					<li>
						<input type="submit" class="button button-primary" name="export_jeunesse_data" value="<?php esc_attr_e('Exporter', 'citeo-jeunesse'); ?>">
					</li>
				</ul>
            </form>
        </div>
        <?php
	}

	// Fonction d'exportation des données
    public function handle_export() {
        if (isset($_POST['export_jeunesse_data'])) {

			// Vérification de sécurité
			if (!current_user_can('manage_options') 
				|| !wp_verify_nonce($_POST['citeo_nonce'], 'citeo_export_data')) {
				wp_die(__('Accès non autorisé', 'citeo-jeunesse'));
			}
			
			$table_export = sanitize_key($_POST['table_export'] ?? 'form');
        	$export_type = sanitize_key($_POST['type_export'] ?? 'all');

			$dates_valid = true;
			$start_date = sanitize_text_field($_POST['start_date'] ?? '');
			$end_date = sanitize_text_field($_POST['end_date'] ?? '');
			if ($start_date && $end_date) {
				$dates_valid = $this->validate_dates($start_date, $end_date);
			}

			if ($dates_valid) {
				$this->export_to_csv(
					$start_date ?: null,
					$end_date ?: null,
					$export_type,
					$table_export
				);
			} else {
				add_action('admin_notices', function() {
					echo '<div class="notice notice-error"><p>'
					. esc_html__('Plage de dates invalide', 'citeo-jeunesse')
					. '</p></div>';
				});
			}

        }
    }

	private function validate_dates($start_date, $end_date) {
        $start_timestamp = strtotime($start_date);
        $end_timestamp = strtotime($end_date);
        return $start_timestamp && $end_timestamp && $start_timestamp <= $end_timestamp;
    }

    private function export_to_csv($start_date, $end_date, $export_type, $table_export = 'form') {
    	global $wpdb;
		// Détermination de la table
		$tables = [
			'form' => 'citeo_jeunesse_form',
			'sondage' => 'citeo_jeunesse_sondage'
		];
		// $table_name = $wpdb->prefix . $tables[$table_export];
		$filename = sprintf(
			'%s-export-%s.csv',
			$table_export,
			date('Y-m-d-His')
		);
		try {
			// Construction de la requête SQL
			$query = $this->build_export_query(
				$table_export,
				$export_type,
				$start_date,
				$end_date
			);

			// Exécution de la requête
			$results = $wpdb->get_results($query, ARRAY_A);



			if (empty($results)) {
				throw new Exception(__('Aucune donnée trouvée', 'citeo-jeunesse'));
			}

			// Configuration CSV
			header('Content-Type: text/csv; charset=utf-8');
			header('Content-Disposition: attachment; filename="' . $filename . '"');
			
			$output = fopen('php://output', 'w');
			fputs($output, "\xEF\xBB\xBF"); // BOM UTF-8
			
			// En-têtes conditionnels
			fputcsv($output, $this->get_csv_headers($table_export), ';');
			
			// Écriture des données
			foreach ($results as $row) {
				fputcsv($output, $this->sanitize_row($row, $table_export), ';');
			}
			
			fclose($output);
			exit();

		} catch (Exception $e) {
			add_action('admin_notices', function() use ($e) {
				echo '<div class="notice notice-error"><p>'
				. esc_html($e->getMessage())
				. '</p></div>';
			});
		}
    }

	/**
	 * Construit la requête SQL en fonction des paramètres
	 */
	private function build_export_query($table_type, $export_type, $start_date, $end_date) {
		global $wpdb;
		
		$where = [];
		$placeholders = [];
		$table_name = $wpdb->prefix . ($table_type === 'sondage' 
			? 'citeo_jeunesse_sondage' 
			: 'citeo_jeunesse_form');

		// Sélection des colonnes
		$columns = ($table_type === 'form')
			? 'ID, type, statut, nombre_enfant, visionnement_video, opt_in, date_inscription, refuse_survey'
			: 'email, date_inscription';

		// Filtres communs de date
		if ($start_date && $end_date) {
			$where[] = 'date_inscription BETWEEN %s AND %s';
			$placeholders[] = $start_date . ' 00:00:00';
			$placeholders[] = $end_date . ' 23:59:59';
		}

		// Filtres spécifiques au formulaire
		if ($table_type === 'form') {
			switch ($export_type) {
				case 'video':
					$where[] = 'type = %s';
					$placeholders[] = 'video';
					break;
				case 'autre':
					$where[] = 'type = %s';
					$placeholders[] = 'autre';
					break;
				case 'opt_in':
					$where[] = 'opt_in = %d';
					$placeholders[] = 1;
					break;
			}
		}

		// Construction finale de la requête
		$query = "SELECT $columns FROM $table_name";
		
		if (!empty($where)) {
			$query .= ' WHERE ' . implode(' AND ', $where);
		}
		
		$query .= ' ORDER BY date_inscription DESC';

		return $wpdb->prepare($query, $placeholders);
	}

	/**
	 * Retourne les en-têtes CSV appropriés
	 */
	private function get_csv_headers($table_type) {
		return $table_type === 'sondage' 
			? [__('Email', 'citeo-jeunesse'), __('Date d\'inscription', 'citeo-jeunesse')]
			: [
				__('ID', 'citeo-jeunesse'),
				__('Type', 'citeo-jeunesse'),
				__('Statut', 'citeo-jeunesse'),
				__('Nombre d\'enfants', 'citeo-jeunesse'),
				__('Visionnage enfants', 'citeo-jeunesse'),
				__('Abonné Newsletter', 'citeo-jeunesse'),
				__('Date', 'citeo-jeunesse'),
				__('Refuse Sondage', 'citeo-jeunesse')
			];
	}

	/**
	 * Assainit les données selon le type de table
	 */
	private function sanitize_row($row, $table_type) {
		if ($table_type === 'sondage') {
			return [
				sanitize_email($row['email']),
				sanitize_text_field($row['date_inscription'])
			];
		}

		$columns_bool = ['visionnement_video', 'opt_in', 'refuse_survey'];
		$transformed = [];

		foreach ($row as $key => $value) {
			if (in_array($key, $columns_bool)) {
				// Conversion des valeurs booléennes
				$transformed[$key] = ($value == 1) ? 
					__('Oui', 'citeo-jeunesse') : 
					__('Non', 'citeo-jeunesse');
			} else {
				// Sanitization standard
				$transformed[$key] = is_email($value) ? 
					sanitize_email($value) : 
					sanitize_text_field($value);
			}
		}

		return $transformed;
	}

	public function displayAdminSondage() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'citeo_jeunesse_sondage';
		
		// Gestion de l'export CSV
		if (isset($_GET['action']) && $_GET['action'] === 'export_csv') {
			$this->handleExportCSV();
		}
        
        // Gestion de la pagination
        $per_page = 20;
        $current_page = max(1, isset($_GET['paged']) ? absint($_GET['paged']) : 1);
        $offset = ($current_page - 1) * $per_page;

        // Récupération des données en toute sécurité
        $total_items = $wpdb->get_var("SELECT COUNT(ID) FROM $table_name");
        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT email, date_inscription 
                 FROM $table_name 
                 ORDER BY date_inscription DESC 
                 LIMIT %d OFFSET %d",
                $per_page,
                $offset
            ),
            ARRAY_A
        );

        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Participants au sondage', 'citeo-jeunesse') . '</h1>';

		// Ajout du bouton d'export
		$export_url = wp_nonce_url(
			add_query_arg(['action' => 'export_csv']),
			'citeo_export_csv'
		);
		echo '<a href="' . esc_url($export_url) . '" class="button button-primary" style="margin: 20px 0;">' . esc_html__('Exporter en CSV', 'citeo-jeunesse') . '</a>';
        
        $this->display_pagination($total_items, $per_page, $current_page);
        $this->display_results_table($results);
        $this->display_pagination($total_items, $per_page, $current_page);

        echo '</div>';
    }

    private function display_results_table($results) {
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead>
                <tr>
                    <th>' . esc_html__('Email', 'citeo-jeunesse') . '</th>
                    <th>' . esc_html__('Date d\'inscription', 'citeo-jeunesse') . '</th>
                </tr>
              </thead>';
        
        echo '<tbody>';
        if (!empty($results)) {
            foreach ($results as $row) {
                echo '<tr>';
                echo '<td>' . esc_html($row['email']) . '</td>';
                echo '<td>' . esc_html($row['date_inscription']) . '</td>';
                echo '</tr>';
            }
        } else {
            echo '<tr><td colspan="2">' . esc_html__('Aucun résultat trouvé', 'citeo-jeunesse') . '</td></tr>';
        }
        echo '</tbody></table>';
    }

    private function display_pagination($total_items, $per_page, $current_page) {
        $total_pages = ceil($total_items / $per_page);
		$paged = isset($_GET['paged']) ? absint($_GET['paged']) : 1;

		// Génération de la pagination
		$pagination = paginate_links(array(
			'base' => add_query_arg('paged', '%#%'),
			'format' => '',
			'prev_text' => __('‹'),
			'next_text' => __('›'),
			'total' => $total_pages,
			'current' => $current_page,
			'type' => 'array'
		));

        
        // Affichage natif WordPress
		echo '<div class="tablenav top">';
		echo '<div class="tablenav-pages">';
		echo '<span class="displaying-num">' . number_format_i18n($total_items) . ' éléments</span>';
		if ($total_pages) : 
			echo '<span class="pagination-links">';
				echo $this->format_pagination_links($pagination, $paged, $total_pages);
			echo '</span>';
		endif;
		echo '</div>';
		echo '<br class="clear">';
		echo '</div>';
    }

	/**
	 * Gère l'export CSV des données
	 * @return void
	 */
	private function handleExportCSV() {
		// Vérification sécurité
		if (!current_user_can('manage_options') || !wp_verify_nonce($_REQUEST['_wpnonce'], 'citeo_export_csv')) {
			wp_die(__('Accès non autorisé', 'citeo-jeunesse'));
		}

		global $wpdb;
		$table_name = $wpdb->prefix . 'citeo_jeunesse_sondage';

		// Récupération de toutes les données
		$data = $wpdb->get_results(
			"SELECT email, date_inscription 
			FROM $table_name 
			ORDER BY date_inscription DESC",
			ARRAY_A
		);

		// Configuration de l'export
		$filename = 'participants-sondage-' . date('Y-m-d') . '.csv';
		
		// Envoi des en-têtes HTTP
		header('Content-Type: text/csv; charset=utf-8');
		header('Content-Disposition: attachment; filename="' . $filename . '"');
		
		// Création du fichier de sortie
		$output = fopen('php://output', 'w');
		
		// Ajout BOM UTF-8 pour Excel
		fputs($output, "\xEF\xBB\xBF");
		
		// En-têtes CSV
		fputcsv($output, [
			esc_html__('Email', 'citeo-jeunesse'),
			esc_html__('Date d\'inscription', 'citeo-jeunesse')
		], ';');
		
		// Données
		foreach ($data as $row) {
			fputcsv($output, [
				sanitize_email($row['email']),
				$row['date_inscription']
			], ';');
		}
		
		fclose($output);
		exit;
	}
}
