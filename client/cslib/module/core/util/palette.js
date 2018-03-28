'use strict';

define(function (require) {

  // List taken from http://stackoverflow.com/questions/470690/how-to-automatically-generate-n-distinct-colors
  return ['#FFB300', // Vivid Yellow
  '#803E75', // Strong Purple
  '#A6BDD7', // Very Light Blue
  '#C10020', // Vivid Red
  '#CEA262', // Grayish Yellow
  '#817066', // Medium Gray
  '#FF6800', // Vivid Orange
  '#000000', // Black

  // not colorblind-safe
  '#007D34', // Vivid Green
  '#F6768E', // Strong Purplish Pink
  '#00538A', // Strong Blue
  '#FF7A5C', // Strong Yellowish Pink
  '#53377A', // Strong Violet
  '#FF8E00', // Vivid Orange Yellow
  '#B32851', // Strong Purplish Red
  '#F4C800', // Vivid Greenish Yellow
  '#7F180D', // Strong Reddish Brown
  '#93AA00', // Vivid Yellowish Green
  '#593315', // Deep Yellowish Brown
  '#F13A13', // Vivid Reddish Orange
  '#232C16'];
} // Dark Olive Green
);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL3V0aWwvcGFsZXR0ZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTs7QUFFbEI7QUFDQSxTQUFPLENBQ0wsU0FESyxFQUNNO0FBQ1gsV0FGSyxFQUVNO0FBQ1gsV0FISyxFQUdNO0FBQ1gsV0FKSyxFQUlNO0FBQ1gsV0FMSyxFQUtNO0FBQ1gsV0FOSyxFQU1NO0FBQ1gsV0FQSyxFQU9NO0FBQ1gsV0FSSyxFQVFNOztBQUVYO0FBQ0EsV0FYSyxFQVdNO0FBQ1gsV0FaSyxFQVlNO0FBQ1gsV0FiSyxFQWFNO0FBQ1gsV0FkSyxFQWNNO0FBQ1gsV0FmSyxFQWVNO0FBQ1gsV0FoQkssRUFnQk07QUFDWCxXQWpCSyxFQWlCTTtBQUNYLFdBbEJLLEVBa0JNO0FBQ1gsV0FuQkssRUFtQk07QUFDWCxXQXBCSyxFQW9CTTtBQUNYLFdBckJLLEVBcUJNO0FBQ1gsV0F0QkssRUFzQk07QUFDWCxXQXZCSyxDQUFQO0FBeUJELENBNUJELENBMEJlO0FBMUJmIiwiZmlsZSI6Im1vZHVsZS9jb3JlL3V0aWwvcGFsZXR0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBcbiAgLy8gTGlzdCB0YWtlbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDcwNjkwL2hvdy10by1hdXRvbWF0aWNhbGx5LWdlbmVyYXRlLW4tZGlzdGluY3QtY29sb3JzXG4gIHJldHVybiBbXG4gICAgJyNGRkIzMDAnLCAvLyBWaXZpZCBZZWxsb3dcbiAgICAnIzgwM0U3NScsIC8vIFN0cm9uZyBQdXJwbGVcbiAgICAnI0E2QkRENycsIC8vIFZlcnkgTGlnaHQgQmx1ZVxuICAgICcjQzEwMDIwJywgLy8gVml2aWQgUmVkXG4gICAgJyNDRUEyNjInLCAvLyBHcmF5aXNoIFllbGxvd1xuICAgICcjODE3MDY2JywgLy8gTWVkaXVtIEdyYXlcbiAgICAnI0ZGNjgwMCcsIC8vIFZpdmlkIE9yYW5nZVxuICAgICcjMDAwMDAwJywgLy8gQmxhY2tcblxuICAgIC8vIG5vdCBjb2xvcmJsaW5kLXNhZmVcbiAgICAnIzAwN0QzNCcsIC8vIFZpdmlkIEdyZWVuXG4gICAgJyNGNjc2OEUnLCAvLyBTdHJvbmcgUHVycGxpc2ggUGlua1xuICAgICcjMDA1MzhBJywgLy8gU3Ryb25nIEJsdWVcbiAgICAnI0ZGN0E1QycsIC8vIFN0cm9uZyBZZWxsb3dpc2ggUGlua1xuICAgICcjNTMzNzdBJywgLy8gU3Ryb25nIFZpb2xldFxuICAgICcjRkY4RTAwJywgLy8gVml2aWQgT3JhbmdlIFllbGxvd1xuICAgICcjQjMyODUxJywgLy8gU3Ryb25nIFB1cnBsaXNoIFJlZFxuICAgICcjRjRDODAwJywgLy8gVml2aWQgR3JlZW5pc2ggWWVsbG93XG4gICAgJyM3RjE4MEQnLCAvLyBTdHJvbmcgUmVkZGlzaCBCcm93blxuICAgICcjOTNBQTAwJywgLy8gVml2aWQgWWVsbG93aXNoIEdyZWVuXG4gICAgJyM1OTMzMTUnLCAvLyBEZWVwIFllbGxvd2lzaCBCcm93blxuICAgICcjRjEzQTEzJywgLy8gVml2aWQgUmVkZGlzaCBPcmFuZ2VcbiAgICAnIzIzMkMxNicsIC8vIERhcmsgT2xpdmUgR3JlZW5cbiAgXVxufSkiXX0=
