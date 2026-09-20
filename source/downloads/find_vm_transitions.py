"""Find executed VM-range departures, not automatically verified VM exits.

Input is an uninterrupted, single-thread x64dbg pre-instruction text trace.
Accepts RIP|RSP|RAX|RCX|instruction, or the article's 14-column full trace.
All trace numbers are hexadecimal. Ranges are half-open RVAs.
"""
import argparse
import json
from pathlib import Path


def records(path):
    short = ('rip', 'rsp', 'rax', 'rcx')
    full = ('rip', 'rsp', 'rbp', 'rbx', 'rdi', 'r8', 'r9', 'r10',
            'r11', 'rax', 'rcx', 'rdx', 'rsi')
    for line_number, line in enumerate(Path(path).read_text(encoding='utf-8-sig').splitlines(), 1):
        if not line.strip():
            continue
        fields = line.split('|')
        names = short if len(fields) == 5 else full if len(fields) == 14 else None
        if names is None:
            raise ValueError(f'Line {line_number}: expected 5 or 14 columns')
        try:
            state = dict(zip(names, (int(s.strip(), 16) for s in fields[:-1])))
        except ValueError as exc:
            raise ValueError(f'Line {line_number}: invalid hexadecimal register') from exc
        yield state, fields[-1].strip(), line_number


def find(path, base, ranges):
    def inside(va):
        return any(lo <= va - base < hi for lo, hi in ranges)
    previous = None
    for current in records(path):
        if previous and inside(previous[0]['rip']) and not inside(current[0]['rip']):
            before, instruction, line = previous
            after = current[0]
            yield {
                'classification': 'range departure; manual verification required',
                'source_line': line,
                'transfer_va': hex(before['rip']),
                'transfer_rva': hex(before['rip'] - base),
                'instruction': instruction,
                'destination_va': hex(after['rip']),
                'destination_minus_main_base': hex(after['rip'] - base),
                'rsp_delta': after['rsp'] - before['rsp'],
                'destination_registers': {k: hex(v) for k, v in after.items()},
            }
        previous = current


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('trace')
    parser.add_argument('--base', required=True, type=lambda s: int(s, 0))
    parser.add_argument('--vm-range', required=True, action='append', metavar='0xSTART:0xEND')
    args = parser.parse_args()
    ranges = [tuple(int(v, 0) for v in s.split(':')) for s in args.vm_range]
    if any(len(r) != 2 or r[0] < 0 or r[0] >= r[1] for r in ranges):
        parser.error('Each range must contain increasing, nonnegative START:END RVAs')
    print(json.dumps(list(find(args.trace, args.base, ranges)), indent=2))


if __name__ == '__main__':
    main()
