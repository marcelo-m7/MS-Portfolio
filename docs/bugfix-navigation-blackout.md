# Bugfix: Navigation Blackout

## Root Cause

Switching the interface language through Google Translate rewrites the DOM tree of the navigation bar. The animated highlight for the active route relied on `framer-motion`'s layout animations (`motion.span` with `layoutId`). When Google Translate injected its own nodes, the animation tried to move an element relative to a node that no longer existed, throwing `Failed to execute 'insertBefore' on 'Node'`. React consequently unmounted the tree and the user was left with a blank screen until a full refresh.

## Fix

Replaced the layout-driven highlight with a CSS-based gradient pill. The new implementation keeps the visual feedback but does not depend on `framer-motion` DOM re-parenting, so Google Translate can no longer interfere with navigation updates. The change keeps hover effects intact and preserves translation compatibility across all routes and languages.
