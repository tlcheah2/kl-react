/** @jsx jsx */
import { Container, jsx } from 'theme-ui';
import { List } from './list';
import { ScheduleItem } from './schedule-item';
import { SectionHeading } from './section-heading';

export function Schedule({ schedule, speakersOnSamePage }) {
  return (
    <Container>
      <SectionHeading>Schedule</SectionHeading>
      <div>
        <List>
          {schedule.map(item => (
            <li key={item.time}>
              <ScheduleItem {...item} speakersOnSamePage={speakersOnSamePage} />
            </li>
          ))}
        </List>
      </div>
    </Container>
  );
}
