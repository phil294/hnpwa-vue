<template>
  <li v-if="comment">
    <div class="row original" @click="toggle" :class="{ 'hidden-children': !open && !!comment.comments.length }">
      <div class="indent-bar"></div>
      <div class="author txt-grey">
        <div>
          {{comment.time_ago}}
          <a class="toggle">
            {{open ? '[-]' : `[+${children}]`}}
          </a>
        </div>
        <b>{{comment.user}}</b>
      </div>
      <div v-html="comment.content" class="content"></div>
    </div>
    <!-- only non-js solution for sticky styling i could come up with is content duplication (s.a. stackoverflow.com/a/66595824/3779853) -->
    <div class="row sticky mirror" aria-hidden="true" @click="toggle" :title="stickyContent">
      <div class="indent-bar"></div>
      <blockquote class="content">{{ stickyContent }}</blockquote>
    </div>
    <ul v-show="open" class="list-unstyled child-padding" :class="{ 'border-left': comment.comments.length }">
      <comment v-for="comment in comment.comments" :comment="comment" :key="comment.id" />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'comment',
  props: {
    comment: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      open: true,
    };
  },
  computed: {
    children() {
      return (this.comment.comments.length ? this.comment.comments.length : '');
    },
    stickyContent() {
      return this.comment.content
        .replaceAll('<p>', ' ')
        .replace(/<[^>]*>?/gm, '')
        .replace(/&#x([0-9a-fA-F]{1,3});/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
        .replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&quot;', '"')
        .trim()
    }
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if(!this.open && this.$el.getBoundingClientRect().top <= 0) {
        this.$el.scrollIntoView({block: "start", inline: "nearest", behavior: "smooth"});
      }
    },
  },
};
</script>

<style>
  li {
    display: grid;
    grid-template: 1fr / 1fr;
    --indent-bar-width: 3px;
    --indent-padding: clamp(10px, 4%, 50px);
    --indent-color: rgba(110, calc(245 - var(--level) * 25), calc(var(--level) * 25 + 80), 0.8);
    --parent-indent-color: rgba(110, calc(245 - (var(--level) - 1) * 25), calc((var(--level) - 1) * 25 + 80), 0.8);
  }

  ul.child-padding {
    margin-left: var(--indent-padding);
  }

  .border-left {
    border-left: var(--indent-bar-width) solid var(--indent-color);
  }

  .row {
    /* Put original and mirror on top of each other (but only mirror is sticky) */
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    background: white;
  }

  .row.original {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    margin-top: -1px; /* border-collapse */
    z-index: calc(999 - var(--level) * 2 + 1);
    padding-top: 1em;
    padding-bottom: 1em;
  }
  .row.original.hidden-children {
    background: rgb(255, 244, 225);
  }
  .row.mirror {
    position: sticky;
    z-index: calc(999 - var(--level) * 2);
    --sticky-row-height: 2em;
    top: calc(var(--sticky-row-height) * (var(--level) - 1));
  }
  .row.mirror, .row.mirror > blockquote {
    height: var(--sticky-row-height);
    max-width: 100%;
    overflow: hidden;
  }
   .row.mirror > blockquote {
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .content {
    flex: 1;
    overflow-wrap: break-word;
    word-break: break-word;
    margin-left: calc(var(--indent-padding) / 2);
  }
  .content > p:first-child {
    margin-block-start: 0;
  }
  .content > p:last-child {
    margin-block-end: 0;
  }

  .indent-bar {
    float: left;
    width: calc(var(--indent-padding) * 0.35);
    height: var(--indent-bar-width);
    background: var(--parent-indent-color);
    margin-top: calc(1em / 2);
  }
  .author {
    float: right;
    line-height: 1.2em;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: x-small;
    margin-left: 5px;
    margin-bottom: 5px;
  }

  .content pre {
    white-space: pre-wrap;
  }

  .toggle {
    color: inherit;
    padding-left: 5px;
  }
</style>
