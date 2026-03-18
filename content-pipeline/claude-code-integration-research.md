# Claude Code Integration Research Report

**Date:** February 27, 2026  
**Prepared for:** Kyle (Kai Hamil)  
**Topic:** Architecture for incorporating Claude Code alongside OpenClaw as an agent-directed tool

---

## Executive Summary

Claude Code (Anthropic's CLI coding tool) can be integrated with OpenClaw as a sandboxed, agent-directed capability. The key is establishing clear boundaries: OpenClaw Stitch remains the orchestrator, while Claude Code operates as a specialized "Code Executor" agent within the hierarchy. This report outlines the architecture, sandboxing strategy, permission model, and conflict prevention mechanisms.

---

## 1. Understanding Claude Code

### What Claude Code Is
- **CLI tool** that brings Claude directly into the terminal
- **Capabilities:** Code generation, refactoring, debugging, file operations, bash commands
- **Context awareness:** Can read entire codebases, understand project structure
- **Autonomy level:** Can suggest and execute file changes with user approval

### Key Risks for Multi-Agent Systems
1. **File contention** — Both agents modifying same files simultaneously
2. **Permission escalation** — Claude Code has broad file system access
3. **Context collision** — Two AI agents with overlapping context creating confusion
4. **User experience** — Which agent responds? Who "owns" the session?

---

## 2. Proposed Architecture: Hierarchical Delegation

### Core Principle: Single Orchestrator, Specialized Executors

```
┌─────────────────────────────────────┐
│         User (Kyle)                 │
│    Primary interface: Telegram      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    OpenClaw Stitch (Orchestrator)   │
│    - Intent classification          │
│    - Task routing                   │
│    - Context management             │
│    - File locking/coordination      │
└──────────────┬──────────────────────┘
               │
     ┌─────────┴──────────┐
     │                    │
     ▼                    ▼
┌──────────┐      ┌──────────────┐
│  Stitch  │      │ Claude Code  │
│  Native  │      │   Executor   │
│  Tools   │      │   (Sandboxed)│
│          │      │              │
│- File    │      │- Code gen    │
│  ops     │      │- Refactoring │
│- Web     │      │- Debugging   │
│  search  │      │- Testing     │
│- Memory  │      │- Complex     │
│  recall  │      │  logic        │
└──────────┘      └──────────────┘
```

### Role Clarity

| Function | OpenClaw Stitch | Claude Code |
|----------|----------------|-------------|
| **User interface** | ✅ Primary | ❌ No direct access |
| **Intent routing** | ✅ Decides when to invoke Claude | ❌ Receives tasks only |
| **Context management** | ✅ Maintains master context | ❌ Receives scoped sub-tasks |
| **File operations** | ✅ Simple reads/writes | ✅ Complex refactoring (with locks) |
| **Code generation** | ❌ Delegates | ✅ Executes |
| **Session memory** | ✅ Persistent | ❌ Ephemeral per-task |

---

## 3. Sandboxing Strategy

### 3.1 Process-Level Isolation

```bash
# Claude Code runs in isolated subprocess
# With restricted environment variables

CLAUDE_SANDBOX_ROOT="/tmp/claude-sessions/$(uuid)"
CLAUDE_ALLOWED_DIRS="/workspace/projects:/tmp/claude-sessions"
CLAUDE_MAX_EXEC_TIME="300"  # 5 minute timeout
CLAUDE_READONLY_DIRS="/etc:/usr:/home/kyle/.ssh"
```

### 3.2 Workspace Mirroring (Copy-on-Write)

Instead of letting Claude Code work directly in the main workspace:

```python
# Stitch creates a temporary workspace copy
def invoke_claude_code(task, files_needed):
    # 1. Create isolated workspace
    sandbox = create_sandbox(files_needed)
    
    # 2. Claude Code works in sandbox
    result = claude_code.execute(task, cwd=sandbox)
    
    # 3. Review changes (Stitch or user)
    diff = generate_diff(sandbox, original)
    
    # 4. If approved, apply to main workspace
    if approve_changes(diff):
        apply_changes(sandbox, original)
    
    # 5. Destroy sandbox
    cleanup(sandbox)
```

### 3.3 File Locking Mechanism

Prevent concurrent modifications:

```python
# Stitch maintains file lock registry
file_locks = {
    "kaihamil-content/index.html": {
        "locked_by": "stitch",
        "since": "2026-02-27T10:00:00Z",
        "task": "Updating homepage"
    }
}

# Before invoking Claude Code on any file
def can_modify_file(filepath, requesting_agent):
    if filepath in file_locks:
        lock = file_locks[filepath]
        if lock["locked_by"] != requesting_agent:
            return False, f"Locked by {lock['locked_by']} for: {lock['task']}"
    return True, None
```

---

## 4. Permission Model

### 4.1 Tiered Access

| Tier | Capabilities | When Used |
|------|--------------|-----------|
| **Tier 1: Read-Only** | View files, analyze code, suggest changes | Initial assessment, code review |
| **Tier 2: Sandbox Write** | Modify files in isolated workspace | Development tasks, experiments |
| **Tier 3: Approved Apply** | Changes reviewed before applying to main | Production changes |
| **Tier 4: Direct Write** | Immediate application (emergency only) | Critical fixes, user explicitly approves |

### 4.2 Approval Workflows

```python
# Default: Human-in-the-loop
if claude_code_proposes_changes():
    stitch_presents_diff_to_user()
    if user_approves():
        apply_changes()
    else:
        discard_changes()

# Optional: Stitch auto-approval for low-risk changes
if is_low_risk_change(diff) and confidence > 0.95:
    stitch_auto_approves()
    apply_changes()
    notify_user("Applied low-risk changes automatically")
```

---

## 5. Integration Implementation

### 5.1 Claude Code as OpenClaw Skill

```yaml
# ~/.openclaw/skills/claude-code/config.yaml
name: claude-code
version: 1.0.0
description: Code generation and refactoring via Claude Code

permissions:
  - read: /workspace/**       # Can read any project file
  - write: /tmp/sandbox/**    # Can only write to sandbox
  - execute: /usr/bin/claude  # Can invoke Claude Code binary

invocation:
  trigger: "claude-code"
  examples:
    - "claude-code: refactor the authentication module"
    - "use claude to optimize the database queries"
    - "generate unit tests for the parser"

sandbox:
  type: "copy-on-write"
  max_duration: 300
  allowed_commands:
    - "claude"
    - "git"
    - "npm"
    - "python3"
```

### 5.2 Execution Flow

```
User: "Refactor the AI assessment code to use async/await"

↓ OpenClaw Stitch receives message

Stitch Intent Classification:
- Task type: CODE_REFACTOR
- Target: frameworks/ai-usage-advanced.html
- Complexity: HIGH
- Decision: Delegate to Claude Code

↓ Stitch prepares context

Stitch Actions:
1. Lock target file(s)
2. Copy relevant files to sandbox
3. Craft specific prompt for Claude Code
4. Invoke Claude Code subprocess

↓ Claude Code executes in sandbox

Claude Code Actions:
1. Analyze current code structure
2. Plan refactoring approach
3. Execute changes in sandbox
4. Run tests if available
5. Generate diff report

↓ Stitch reviews and presents

Stitch Actions:
1. Compare sandbox vs original
2. Generate human-readable diff
3. Present to user: "Claude proposes these changes..."
4. Await user decision

↓ User approves/rejects

If approved:
  - Apply changes to original files
  - Release file locks
  - Log action to memory
  - Commit with descriptive message

If rejected:
  - Discard sandbox
  - Release file locks
  - Offer to try different approach
```

---

## 6. Conflict Prevention

### 6.1 Context Isolation

Claude Code receives only what's necessary:

```python
# DON'T: Send entire conversation history
claude_prompt = full_conversation_history  # ❌ Too much context

# DO: Send focused task with relevant files
claude_prompt = f"""
Task: Refactor JavaScript to use async/await

Relevant files:
{read_file("frameworks/ai-usage-advanced.html")}

Specific requirements:
- Convert Promise chains to async/await
- Maintain error handling
- Keep existing functionality

Return only the refactored code sections with brief explanation.
"""
```

### 6.2 Session Management

```python
# Each Claude Code invocation is stateless
claude_session = {
    "id": str(uuid.uuid4()),
    "started_by": "stitch",
    "task": "Refactor authentication",
    "files_involved": ["/auth/login.js"],
    "start_time": datetime.now(),
    "sandbox_path": "/tmp/claude-abc123",
    "status": "active"  # active | completed | failed
}

# No persistence between invocations
# All context provided fresh by Stitch each time
```

### 6.3 Change Detection

Before applying any changes:

```python
def has_file_changed_since_read(filepath, original_hash):
    current_hash = hash_file(filepath)
    return current_hash != original_hash

# If file changed between read and write
if has_file_changed_since_read("index.html", original_hash):
    # Re-read, merge, or abort
    handle_conflict(filepath)
```

---

## 7. User Experience Design

### 7.1 Unified Interface

User always talks to **Stitch**. Never directly to Claude Code.

**User:** "Make the homepage load faster"

**Stitch internally:**
- Analyzes: Performance optimization task
- Decides: Requires code changes
- Invokes: Claude Code for implementation
- Presents: "I can optimize the homepage. Claude suggests: [changes]. Approve?"

### 7.2 Transparency

Always indicate which agent is acting:

> 🧵 **Stitch:** Analyzing your request...
> 
> 🔧 **Claude Code:** Generating optimized version...
> 
> 🧵 **Stitch:** Here's what Claude found: [diff]

### 7.3 Rollback Capability

Every Claude Code change is versioned:

```bash
# Auto-commit before applying changes
git commit -m "[pre-claude] Before: Optimize homepage loading"

# Apply Claude's changes
git apply claude-changes.patch

# If issues:
git reset --hard HEAD~1  # Instant rollback
```

---

## 8. Implementation Roadmap

### Phase 1: Basic Integration (1-2 days)
- [ ] Install Claude Code CLI on host
- [ ] Create OpenClaw skill wrapper
- [ ] Implement basic sandbox (temp directory)
- [ ] Add file locking mechanism
- [ ] Test with simple file edits

### Phase 2: Sandboxing (2-3 days)
- [ ] Implement copy-on-write workspace
- [ ] Add diff generation and review
- [ ] Create approval workflow
- [ ] Add timeout and resource limits
- [ ] Test with complex refactoring

### Phase 3: Production Hardening (1 week)
- [ ] Add comprehensive logging
- [ ] Implement rollback mechanism
- [ ] Create conflict resolution UI
- [ ] Add auto-approval for low-risk changes
- [ ] Performance optimization

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| File corruption | Low | High | Sandbox + backups + version control |
| Conflicting edits | Medium | Medium | File locks + change detection |
| User confusion | Medium | Low | Clear agent attribution in UI |
| Performance issues | Low | Medium | Timeouts + resource limits |
| Security (unauthorized changes) | Low | High | Tiered permissions + approval workflows |

---

## 10. Recommended Configuration

```yaml
# ~/.openclaw/skills/claude-code/config.yaml

claude_code:
  enabled: true
  
  sandbox:
    type: "copy-on-write"
    temp_root: "/tmp/claude-sessions"
    max_concurrent: 1  # Only one Claude session at a time
    max_duration_seconds: 300
    auto_cleanup: true
    
  permissions:
    read:
      - "/workspace/**"
    write:
      - "/tmp/claude-sessions/**"
    execute:
      - "/usr/bin/claude"
      - "/usr/bin/git"
      - "/usr/bin/node"
      - "/usr/bin/python3"
      
  approval:
    default: "required"  # Always ask user
    auto_approve:
      - pattern: "*.md"  # Markdown files are low-risk
        max_lines: 10
      - pattern: "*.css"  # Style changes are visual
        max_lines: 50
        
  notifications:
    on_start: true
    on_complete: true
    on_error: true
    include_diff: true  # Show changes in notification
```

---

## Summary

Claude Code can be safely integrated with OpenClaw as a **specialized executor** under Stitch's orchestration. Key principles:

1. **Single entry point** — User always talks to Stitch
2. **Sandboxed execution** — Claude works in isolated workspaces
3. **Explicit handoffs** — Clear transfer of control with context
4. **Approval workflows** — Human review before applying changes
5. **File locking** — Prevents concurrent modifications
6. **Transparency** — User always knows which agent is acting

This architecture maintains OpenClaw's hierarchical control while leveraging Claude Code's coding capabilities without risking file conflicts or permission overlaps.

---

**Next Steps:**
1. Review this architecture
2. Approve Phase 1 implementation
3. Identify first test case (suitable coding task)
4. Schedule implementation sprint
