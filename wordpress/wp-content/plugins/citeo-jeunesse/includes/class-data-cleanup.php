<?php
class Data_Cleanup {
    private $table_name;

    public function __construct() {
        global $wpdb;
        $this->table_name = $wpdb->prefix . 'citeo_jeunesse_form';
        $this->table_name_sondage = $wpdb->prefix . 'citeo_jeunesse_sondage';
    }

    public function delete_old_data() {
        global $wpdb;
        
        // Calcule la date de suppression
        $timezone = wp_timezone();
        $cutoff_date = (new DateTime('now', $timezone))
            ->modify('-1 year')
            ->format('Y-m-d H:i:s');

        // Requête sécurisée avec $wpdb->prepare()
        $result = $wpdb->query(
            $wpdb->prepare("
                DELETE FROM {$this->table_name}
                WHERE date_inscription < %s
            ", $cutoff_date)
        );

         $result2 = $wpdb->query(
            $wpdb->prepare("
                DELETE FROM {$this->table_name_sondage}
                WHERE date_inscription < %s
            ", $cutoff_date)
        );

        // Journalisation des erreurs
        if (false === $result || false === $result2) {
            error_log('[Citeo Jeunesse] Erreur lors du nettoyage : ' . $wpdb->last_error);
        }
    }
}
?>