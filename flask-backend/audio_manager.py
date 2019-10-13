from typing import List
import random as r

'''
The handler for all things audio-related in the Symphony of Babel. Every possible audio excerpt from the symphony that is
life, the universe, and everything is contained here, and each excerpt can be located by ID, or queried to locate its ID.
'''

# DEFINE APP-WIDE AUDIO PROPERTIES

# the audio sample rate, in Hz (samples per second)
SAMPLE_RATE = 24000

# the number of possible different sample values in an audio excerpt
# (limiting the possibilities in this way greatly decreases the number of possible excerpts which sound the same)
SAMPLE_RANGE = 35

# the duration of each excerpt, in seconds
EXCERPT_DURATION = 5

# the number of samples in each excerpt
TOTAL_SAMPLES = SAMPLE_RATE * EXCERPT_DURATION

# the number of possible audio excerpts in existence (given our data constraints)
TOTAL_EXCERPTS = SAMPLE_RANGE ** TOTAL_SAMPLES

# base 35 digits
B35_DIGITS = ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
              "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y")


def get_sample_values() -> tuple:
    """
    Helper for filling the set of possible sample values.
    :return: the set of all possible sample values
    """
    values = []
    num_loudness_levels = int((SAMPLE_RANGE - 1) / 2)
    for i in range(num_loudness_levels):
        values.append((1.0 - (1.0 / num_loudness_levels) * i) ** 2)
    values.append(0)
    for i in range(num_loudness_levels):
        values.append(values[num_loudness_levels - 1 - i] * -1.0)
    return tuple(values)


# the set of usable sample values, to which all other sample values will be rounded
SAMPLE_VALUES = get_sample_values()
assert (len(SAMPLE_VALUES) == SAMPLE_RANGE)


# DEFINE FUNCTIONS FOR WORKING WITH AUDIO EXCERPTS

def get_random_id() -> str:
    digits = r.choices(B35_DIGITS, k=TOTAL_SAMPLES)
    return ''.join(digits)


def round_sample(sample: float) -> float:
    for i in range(len(SAMPLE_VALUES)):
        if SAMPLE_VALUES[i] < sample:
            if sample - SAMPLE_VALUES[i] > SAMPLE_VALUES[i - 1] - sample:  # TODO: optimize this, it's a linear comparison on a quadratic relation
                return SAMPLE_VALUES[i - 1]
            else:
                return SAMPLE_VALUES[i]
    return 1.0


def get_id_from_buffer(buffer: List[float]) -> str:
    digits = []
    for i in range(TOTAL_SAMPLES):
        if i < len(buffer):
            sample = round_sample(buffer[i])
            sample_level = (SAMPLE_VALUES.index(sample))
            digits.append(B35_DIGITS[sample_level])
        else:
            zero_index = SAMPLE_VALUES.index(sample)
            digits.append(B35_DIGITS[zero_index])
    return ''.join(digits)


def get_excerpt_data(id: str) -> List[int]:
    if len(id) != TOTAL_SAMPLES:
        raise ValueError('Improper length ID -- must be ' + str(TOTAL_SAMPLES) + ' characters long.')
    excerpt_data = []
    for b35_digit in id:
        if b35_digit.lower() not in B35_DIGITS:
            raise ValueError('ID must only contain alphanumeric characters, excluding "Z".')
        sample_index = int(b35_digit, 35)
        excerpt_data.append(SAMPLE_VALUES[sample_index])
    return excerpt_data
