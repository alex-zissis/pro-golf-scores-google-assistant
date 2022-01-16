/** @jsx _ssml */
import _ssml, {FC} from 'ssml-tsx';
import numToWords from 'number-to-words';

interface GolfScoreProps {
    score: number;
}

const GolfScore: FC<GolfScoreProps> = ({score}) => {
    if (score === 0) {
        return <sub alias="even par">E</sub>;
    }

    return (
        <sub alias={`${numToWords.toWords(Math.abs(score)).replaceAll('-', ' ')} ${score < 0 ? 'under' : 'over'}`}>
            {score > 0 && '+'}
            {score}
        </sub>
    );
};
export {GolfScore};
