import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { bio } from '../lib/resumeData';

export const About = () => {
    return (
        <Section id="about" label="About">
            <SectionHeading command="cat about.md" label="About" />
            <div className="shell-output">
                <p className="t-body">{bio}</p>
            </div>
        </Section>
    );
};
