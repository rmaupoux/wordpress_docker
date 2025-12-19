// PHP generated and localized JSON, see citeo-semantic.php 
const main_icons =  iconListJSON?.filter(tax => tax.name !== 'illustration' && tax.name !== 'menu-icons' && Object.values(tax.list).length > 0)
                                .map(tax => {
                                    const list = Object.values((tax.list));
                                    if(list.length > 0) return list
                                })

const resetEntry = {
    label: 'Aucun',
    value: ''
}

const icons_list = main_icons?.flat(1);
icons_list?.sort((a, b) => a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1);
icons_list?.unshift(resetEntry);

const illustration_list = Object.values(iconListJSON?.filter(tax => tax.name === 'illustration')[0].list);
illustration_list?.sort((a, b) => a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1);
illustration_list?.unshift(resetEntry);