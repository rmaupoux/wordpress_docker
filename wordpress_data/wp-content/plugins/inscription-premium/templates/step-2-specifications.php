<?php
/**
 * Étape 2 — Specifications (Général, Motorisation, Layout, Contact, Price).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$boat_map    = ip_boat_field_map();
$contact_map = ip_contact_field_map();
$countries   = ip_get_country_list();

$general = $draft['general'] ?? array();
$engine  = $draft['engine'] ?? array();
$layout  = $draft['layout'] ?? array();
$price   = $draft['price'] ?? array();
$contact = $draft['contact'] ?? array();

if ( empty( $contact['name'] ) ) {
	$current_user     = wp_get_current_user();
	$contact['name']  = $current_user->display_name;
	$contact['email'] = $current_user->user_email;
}
?>
<section class="ip-tunnel-step ip-step-specifications" data-ip-step="2">
	<form id="ip-step2-form" class="ip-spec-form" novalidate>

		<fieldset class="ip-spec-section">
			<legend><?php esc_html_e( 'Général', 'inscription-premium' ); ?></legend>

			<label>
				<?php echo esc_html( $boat_map['general']['model']['label'] ); ?>
				<input type="text" name="general[model]" value="<?php echo esc_attr( $general['model'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['localisation']['label'] ); ?>
				<select name="general[localisation]">
					<option value=""><?php esc_html_e( '— Choisir —', 'inscription-premium' ); ?></option>
					<?php foreach ( $countries as $country ) : ?>
						<option value="<?php echo esc_attr( $country ); ?>" <?php selected( $general['localisation'] ?? '', $country ); ?>>
							<?php echo esc_html( $country ); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['town']['label'] ); ?>
				<input type="text" name="general[town]" value="<?php echo esc_attr( $general['town'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['year']['label'] ); ?>
				<input type="number" min="1900" max="<?php echo esc_attr( gmdate( 'Y' ) + 1 ); ?>" name="general[year]" value="<?php echo esc_attr( $general['year'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['builder']['label'] ); ?>
				<input type="text" name="general[builder]" value="<?php echo esc_attr( $general['builder'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['length_ft']['label'] ); ?>
				<input type="number" step="0.1" min="0" name="general[length_ft]" value="<?php echo esc_attr( $general['length_ft'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['draft']['label'] ); ?>
				<input type="number" step="0.1" min="0" name="general[draft]" value="<?php echo esc_attr( $general['draft'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['gross_tonnage']['label'] ); ?>
				<input type="number" step="0.1" min="0" name="general[gross_tonnage]" value="<?php echo esc_attr( $general['gross_tonnage'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['general']['capacity']['label'] ); ?>
				<input type="number" min="0" name="general[capacity]" value="<?php echo esc_attr( $general['capacity'] ?? '' ); ?>" />
			</label>
		</fieldset>

		<fieldset class="ip-spec-section">
			<legend><?php esc_html_e( 'Motorisation', 'inscription-premium' ); ?></legend>

			<label>
				<?php echo esc_html( $boat_map['engine']['engine']['label'] ); ?>
				<input type="text" name="engine[engine]" value="<?php echo esc_attr( $engine['engine'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['engine']['fuel']['label'] ); ?>
				<input type="text" name="engine[fuel]" value="<?php echo esc_attr( $engine['fuel'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['engine']['engine_hours']['label'] ); ?>
				<input type="number" min="0" name="engine[engine_hours]" value="<?php echo esc_attr( $engine['engine_hours'] ?? '' ); ?>" />
			</label>
		</fieldset>

		<fieldset class="ip-spec-section">
			<legend><?php esc_html_e( 'Layout', 'inscription-premium' ); ?></legend>

			<label>
				<?php echo esc_html( $boat_map['layout']['cabins']['label'] ); ?>
				<input type="number" min="0" name="layout[cabins]" value="<?php echo esc_attr( $layout['cabins'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['layout']['bed']['label'] ); ?>
				<input type="number" min="0" name="layout[bed]" value="<?php echo esc_attr( $layout['bed'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $boat_map['layout']['shower_room']['label'] ); ?>
				<input type="number" min="0" name="layout[shower_room]" value="<?php echo esc_attr( $layout['shower_room'] ?? '' ); ?>" />
			</label>
		</fieldset>

		<fieldset class="ip-spec-section">
			<legend><?php esc_html_e( 'Contact informations', 'inscription-premium' ); ?></legend>

			<label>
				<?php esc_html_e( 'Name', 'inscription-premium' ); ?>
				<input type="text" name="contact[name]" value="<?php echo esc_attr( $contact['name'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $contact_map['email']['label'] ); ?>
				<input type="email" name="contact[email]" value="<?php echo esc_attr( $contact['email'] ?? '' ); ?>" />
			</label>

			<label>
				<?php echo esc_html( $contact_map['phone']['label'] ); ?>
				<input type="tel" name="contact[phone]" value="<?php echo esc_attr( $contact['phone'] ?? '' ); ?>" />
			</label>
		</fieldset>

		<fieldset class="ip-spec-section">
			<legend><?php esc_html_e( 'Price', 'inscription-premium' ); ?></legend>

			<label>
				<?php echo esc_html( $boat_map['price']['price']['label'] ); ?>
				<input type="number" min="0" step="0.01" name="price[price]" value="<?php echo esc_attr( $price['price'] ?? '' ); ?>" />
			</label>

			<fieldset class="ip-radio-group">
				<legend><?php echo esc_html( $boat_map['price']['vat_paid']['label'] ); ?></legend>
				<label><input type="radio" name="price[vat_paid]" value="1" <?php checked( ! empty( $price['vat_paid'] ) ); ?> /> <?php esc_html_e( 'Yes', 'inscription-premium' ); ?></label>
				<label><input type="radio" name="price[vat_paid]" value="0" <?php checked( empty( $price['vat_paid'] ) ); ?> /> <?php esc_html_e( 'No', 'inscription-premium' ); ?></label>
			</fieldset>
		</fieldset>

		<p class="ip-form-error" id="ip-step2-error" hidden></p>

		<div class="ip-step-actions">
			<button type="submit" class="ip-btn ip-btn-primary"><?php esc_html_e( 'Continue', 'inscription-premium' ); ?></button>
		</div>
	</form>
</section>
