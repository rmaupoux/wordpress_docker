import { useSelect,  } from '@wordpress/data';

// Retrieve ENV_LIST from both b2b and b2c plugins
export let ENV_LIST = [];
try {
    const b2b = await import('../../b2b/assets/env-list.js');
    ENV_LIST = [...(b2b.ENV_LIST ?? [])];
} catch (_) {
    console.warn('b2b ENV_LIST missing');
}

try {
    const b2c = await import('../../b2b/assets/env-list.js');
    ENV_LIST = [...ENV_LIST, ...(b2c.ENV_LIST ?? [])];
} catch (_) {
    console.warn('b2c ENV_LIST missing');
}

// UTIL FUNCTION TO FIND A targetBlockName INSIDE A parentClientId BLOCK AT ANY N LEVEL OF DEPTH
export const useFindNestedBlocks = ( parentClientId, targetBlockName ) => {
    return useSelect( ( select ) => {
        const { getBlock } = select( 'core/block-editor' );
        const parentBlock = getBlock( parentClientId );
        if ( ! parentBlock ) return [];

        const findBlocksRecursively = ( block ) => {
            let matches = [];

            if ( targetBlockName === block.name ) {
                matches.push( block );
            }

            for ( const inner of block.innerBlocks ) {
                matches = matches.concat( findBlocksRecursively( inner ) );
            }

            return matches;
        };

        let allMatches = [];

        for ( const inner of parentBlock.innerBlocks ) {
            allMatches = allMatches.concat( findBlocksRecursively( inner ) );
        }

        return allMatches;
    }, [ parentClientId, targetBlockName ] );
};

// Importing illustration list
import Addition from '../src/block_MC-516_illustration/illustrations/Addition.svg';
import Ampoule from '../src/block_MC-516_illustration/illustrations/Ampoule.svg';
import Bocal_recyclage from '../src/block_MC-516_illustration/illustrations/Bocal_recyclage.svg';
import Boite from '../src/block_MC-516_illustration/illustrations/Boite.svg';
import Carton from '../src/block_MC-516_illustration/illustrations/Carton.svg';
import Cartouche_recyclage from '../src/block_MC-516_illustration/illustrations/Cartouche_recyclage.svg';
import Check from '../src/block_MC-516_illustration/illustrations/Check.svg';
import Cycle from '../src/block_MC-516_illustration/illustrations/Cycle.svg';
import Exclamation from '../src/block_MC-516_illustration/illustrations/Exclamation.svg';
import Flèche_bas from '../src/block_MC-516_illustration/illustrations/Flèche_bas.svg';
import Flèche_droite from '../src/block_MC-516_illustration/illustrations/Flèche_droite.svg';
import Flèche_gauche from '../src/block_MC-516_illustration/illustrations/Flèche_gauche.svg';
import Flèche_haut from '../src/block_MC-516_illustration/illustrations/Flèche_haut.svg';
import Guillemets from '../src/block_MC-516_illustration/illustrations/Guillemets.svg';
import Loupe from '../src/block_MC-516_illustration/illustrations/Loupe.svg';
import Megaphone from '../src/block_MC-516_illustration/illustrations/Megaphone.svg';
import Poids from '../src/block_MC-516_illustration/illustrations/Poids.svg';
import Pourcentage from '../src/block_MC-516_illustration/illustrations/Pourcentage.svg';
import Question from '../src/block_MC-516_illustration/illustrations/Question.svg';

export const illustrations_list = 
{
	Addition,
	Ampoule,
	Bocal_recyclage,
	Boite,
	Carton,
	Cartouche_recyclage,
	Check,
	Cycle,
	Exclamation,
	Flèche_bas,
	Flèche_droite,
	Flèche_gauche,
	Flèche_haut,
	Guillemets,
	Loupe,
	Megaphone,
	Poids,
	Pourcentage,
	Question
};