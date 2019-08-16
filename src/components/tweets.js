/** @jsx jsx */
import { useState, useEffect, useReducer } from 'react';
import { Container, jsx } from 'theme-ui';
import { useInterval } from '../hooks/use-interval';
import { Tweet } from './tweet';

const DEFAULT_INTERVAL = 4000;

export const Tweets = ({ tweets = [] }) => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'next':
          return {
            ...state,
            index: tweets.length - 1 === state.index ? 0 : state.index + 1,
            interval: state.interval === null ? null : DEFAULT_INTERVAL,
          };

        case 'prev':
          return {
            ...state,
            index: state.index === 0 ? tweets.length - 1 : state.index - 1,
            interval: state.interval === null ? null : DEFAULT_INTERVAL,
          };

        case 'setInterval':
          return {
            ...state,
            interval: state.interval === null ? null : action.payload,
          };

        case 'toggle':
          return {
            ...state,
            interval: state.interval === null ? DEFAULT_INTERVAL : null,
          };

        default:
          throw new Error(`Action not defined: ${action.type}`);
      }
    },
    {
      index: 0,
      interval: DEFAULT_INTERVAL,
    }
  );

  const reset = useInterval(() => {
    dispatch({ type: 'next' });
  }, state.interval);

  return (
    <div
      id="tweets"
      sx={{
        py: 2,
      }}
    >
      <Container sx={{ py: 0 }}>
        <div
          sx={{
            position: 'fixed',
            right: 2,
            bottom: 2,
            zIndex: 1,
          }}
        >
          <button
            onClick={() => {
              reset();
              dispatch({ type: 'prev' });
            }}
          >
            Prev
          </button>
          <button onClick={() => dispatch({ type: 'toggle' })}>
            {state.interval === null ? 'Play' : 'Pause'} timeout:{' '}
            {state.interval}
          </button>
          <button
            onClick={() => {
              reset();
              dispatch({ type: 'next' });
            }}
          >
            Next
          </button>
        </div>
        <div>
          {tweets
            .filter((_, index) => index === state.index)
            .map(tweet => (
              <TweetItem
                setDelay={int =>
                  dispatch({ type: 'setInterval', payload: int })
                }
                {...tweet}
                key={tweet.id}
              />
            ))}
        </div>
      </Container>
    </div>
  );
};

function TweetItem({ setDelay, displayedText, ...props }) {
  const [videoDuration, setVideoDuration] = useState(null);

  useEffect(() => {
    if (displayedText && displayedText.length > 80) {
      setDelay((displayedText.length / 80) * DEFAULT_INTERVAL);
    }
  }, [displayedText]);

  useEffect(() => {
    if (videoDuration) {
      setDelay(videoDuration + 1000);
    }
  }, [videoDuration]);

  return (
    <Tweet
      {...props}
      displayedText={displayedText}
      onVideoPlay={setVideoDuration}
      sx={{
        height: `calc(100vh - 100px)`,
      }}
    />
  );
}
